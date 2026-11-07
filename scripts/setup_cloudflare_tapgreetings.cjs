const fs = require('fs');

const CF_EMAIL = process.env.CF_EMAIL || 'chadkaden@gmail.com';
const CF_KEY = process.env.CF_KEY || process.env.CLOUDFLARE_API_KEY;
const TUNNEL_ID = process.env.CF_TUNNEL_ID || '5b9c81ba-5dd7-44eb-8429-9b3c84118532';
const ACCOUNT_ID = process.env.CF_ACCOUNT_ID || 'd3c11a478d15852bca58d57c57613034';

async function cfFetch(path, options = {}) {
  const url = `https://api.cloudflare.com/client/v4${path}`;
  const headers = {
    'X-Auth-Email': CF_EMAIL,
    'X-Auth-Key': CF_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function main() {
  console.log('=== 1. Checking Zones in Cloudflare ===');
  const zonesRes = await cfFetch('/zones?name=tapgreetings.com');
  console.log('Zone search response:', zonesRes.status, zonesRes.data.success);
  if (!zonesRes.data.result || zonesRes.data.result.length === 0) {
    console.error('❌ tapgreetings.com not found in Cloudflare zones!');
    // List all zones in account
    const allZones = await cfFetch('/zones?per_page=50');
    console.log('Available zones:', allZones.data.result?.map(z => ({ name: z.name, id: z.id, status: z.status })));
    return;
  }

  const zone = zonesRes.data.result[0];
  const zoneId = zone.id;
  console.log(`✅ Found zone tapgreetings.com: ID = ${zoneId}, status = ${zone.status}`);
  console.log('Nameservers assigned:', zone.name_servers);

  console.log('\n=== 2. Checking Existing DNS Records ===');
  const recordsRes = await cfFetch(`/zones/${zoneId}/dns_records`);
  const records = recordsRes.data.result || [];
  console.log(`Found ${records.length} existing DNS records:`);
  records.forEach(r => console.log(`  [${r.type}] ${r.name} -> ${r.content} (proxied: ${r.proxied})`));

  console.log('\n=== 3. Adding/Updating CNAME Records for Tunnel ===');
  const tunnelTarget = `${TUNNEL_ID}.cfargotunnel.com`;

  // Upsert @ (tapgreetings.com)
  const existingApex = records.find(r => r.name === 'tapgreetings.com' && (r.type === 'CNAME' || r.type === 'A'));
  if (existingApex) {
    console.log(`Updating existing apex record (${existingApex.id})...`);
    const updateRes = await cfFetch(`/zones/${zoneId}/dns_records/${existingApex.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        type: 'CNAME',
        name: '@',
        content: tunnelTarget,
        proxied: true,
        ttl: 1
      })
    });
    console.log('Update apex result:', updateRes.data.success, updateRes.data.errors);
  } else {
    console.log('Creating CNAME record for @ (tapgreetings.com)...');
    const createRes = await cfFetch(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'CNAME',
        name: '@',
        content: tunnelTarget,
        proxied: true,
        ttl: 1
      })
    });
    console.log('Create apex result:', createRes.data.success, createRes.data.errors);
  }

  // Upsert www.tapgreetings.com
  const existingWww = records.find(r => r.name === 'www.tapgreetings.com' && (r.type === 'CNAME' || r.type === 'A'));
  if (existingWww) {
    console.log(`Updating existing www record (${existingWww.id})...`);
    const updateWwwRes = await cfFetch(`/zones/${zoneId}/dns_records/${existingWww.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        type: 'CNAME',
        name: 'www',
        content: tunnelTarget,
        proxied: true,
        ttl: 1
      })
    });
    console.log('Update www result:', updateWwwRes.data.success, updateWwwRes.data.errors);
  } else {
    console.log('Creating CNAME record for www (www.tapgreetings.com)...');
    const createWwwRes = await cfFetch(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'CNAME',
        name: 'www',
        content: tunnelTarget,
        proxied: true,
        ttl: 1
      })
    });
    console.log('Create www result:', createWwwRes.data.success, createWwwRes.data.errors);
  }

  console.log('\n=== 4. Checking and Updating Cloudflare Tunnel Ingress Configurations ===');
  // Fetch current tunnel configurations
  const tunnelConfigRes = await cfFetch(`/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/configurations`);
  console.log('Tunnel config status:', tunnelConfigRes.status);
  
  if (tunnelConfigRes.data.success && tunnelConfigRes.data.result) {
    const currentConfig = tunnelConfigRes.data.result.config || {};
    const ingress = currentConfig.ingress || [];
    console.log('Current ingress rules count:', ingress.length);
    ingress.forEach(rule => console.log('  Rule:', rule.hostname || '(catch-all)', '->', rule.service));

    let modified = false;

    // Check tapgreetings.com
    if (!ingress.some(r => r.hostname === 'tapgreetings.com')) {
      // Insert before catch-all (which is usually the last rule with service: http_status:404)
      const catchAllIndex = ingress.findIndex(r => !r.hostname);
      const newRule = { hostname: 'tapgreetings.com', service: 'http://localhost:3016' };
      if (catchAllIndex !== -1) {
        ingress.splice(catchAllIndex, 0, newRule);
      } else {
        ingress.push(newRule);
      }
      modified = true;
      console.log('➕ Added ingress rule for tapgreetings.com -> http://localhost:3016');
    }

    // Check www.tapgreetings.com
    if (!ingress.some(r => r.hostname === 'www.tapgreetings.com')) {
      const catchAllIndex = ingress.findIndex(r => !r.hostname);
      const newRule = { hostname: 'www.tapgreetings.com', service: 'http://localhost:3016' };
      if (catchAllIndex !== -1) {
        ingress.splice(catchAllIndex, 0, newRule);
      } else {
        ingress.push(newRule);
      }
      modified = true;
      console.log('➕ Added ingress rule for www.tapgreetings.com -> http://localhost:3016');
    }

    if (modified) {
      console.log('Updating tunnel configuration in Cloudflare...');
      const updateTunnelRes = await cfFetch(`/accounts/${ACCOUNT_ID}/cfd_tunnel/${TUNNEL_ID}/configurations`, {
        method: 'PUT',
        body: JSON.stringify({ config: { ingress } })
      });
      console.log('Tunnel update result:', updateTunnelRes.data.success, updateTunnelRes.data.errors);
    } else {
      console.log('Ingress rules for tapgreetings.com already exist in tunnel!');
    }
  } else {
    console.log('Could not fetch remote tunnel config or tunnel is locally managed. Result:', tunnelConfigRes.data);
  }

  console.log('\n=== 5. Verification ===');
  // Wait 3 seconds for propagation
  await new Promise(r => setTimeout(r, 3000));
  
  const cfDnsCheck = await cfFetch(`/zones/${zoneId}/dns_records`);
  console.log('Live DNS records in zone now:');
  cfDnsCheck.data.result?.forEach(r => console.log(`  [${r.type}] ${r.name} -> ${r.content} (proxied: ${r.proxied})`));
}

main().catch(console.error);
