import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 50 },  // Spike to 50 concurrent users
    { duration: '30s', target: 0 },  // Ramp down
  ],
};

export default function () {
  // Assuming your Apache reverse proxy routes port 80/443 to Next.js on 3000
  const url = 'http://localhost/api/upload-test'; 
  
  const fd = new FormData();
  // Simulate a 1MB payload chunk
  fd.append('file', http.file(new ArrayBuffer(1024 * 1024), 'test-file.bin', 'application/octet-stream'));

  const res = http.post(url, fd.body(), {
    headers: { 'Content-Type': 'multipart/form-data; boundary=' + fd.boundary },
  });

  check(res, {
    'is status 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 500, // Expected under 500ms
  });

  sleep(1);
}