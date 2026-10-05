require('dotenv').config();
const { IngressClient, IngressInput, IngressVideoEncodingPreset, IngressAudioEncodingPreset, TrackSource } = require('livekit-server-sdk');
const { IngressAudioOptions, IngressVideoOptions } = require('@livekit/protocol');
const [userId, username] = process.argv.slice(2);
(async () => {
  const client = new IngressClient(process.env.LIVEKIT_API_URL, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);
  for (const ing of await client.listIngress({ roomName: userId })) { await client.deleteIngress(ing.ingressId); console.error('deleted old ingress', ing.ingressId); }
  const ingress = await client.createIngress(IngressInput.RTMP_INPUT, {
    name: username, roomName: userId, participantName: username, participantIdentity: userId,
    video: new IngressVideoOptions({ source: TrackSource.CAMERA, encodingOptions: { case: 'preset', value: IngressVideoEncodingPreset.H264_720P_30FPS_3_LAYERS } }),
    audio: new IngressAudioOptions({ source: TrackSource.MICROPHONE, encodingOptions: { case: 'preset', value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS } }),
  });
  console.log(JSON.stringify({ ingressId: ingress.ingressId, url: ingress.url, streamKey: ingress.streamKey }));
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
