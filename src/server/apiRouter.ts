import { generateVibeResult, generateRoastMe, generateFriendCompatibility } from './geminiService.ts';

function wrapResponse(res: any) {
  if (!res.status) {
    res.status = function (code: number) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function (data: any) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
      return this;
    };
  }
  return res;
}

export function handleApiRequest(req: any, res: any, next?: any) {
  wrapResponse(res);

  const url = req.url || '';
  const method = (req.method || 'GET').toUpperCase();
  const path = url.split('?')[0];

  if (path === '/health' || path === '/api/health') {
    return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
  }

  let bodyData = '';
  req.on('data', (chunk: any) => {
    bodyData += chunk;
  });

  req.on('end', async () => {
    let body: any = {};
    try {
      body = bodyData ? JSON.parse(bodyData) : {};
    } catch {
      body = {};
    }

    try {
      if (method === 'POST') {
        if (path === '/vibe-check' || path === '/api/vibe-check') {
          const { name, answersSummary } = body;
          const result = await generateVibeResult(name, answersSummary);
          return res.status(200).json(result);
        }

        if (path === '/roast-me' || path === '/api/roast-me') {
          const { name, habit, hobby, randomFact, savageLevel } = body;
          const result = await generateRoastMe(name, habit, hobby, randomFact, savageLevel || 'medium');
          return res.status(200).json(result);
        }

        if (path === '/friend-compatibility' || path === '/api/friend-compatibility') {
          const { user1Name, user2Name, answersSummary } = body;
          const result = await generateFriendCompatibility(user1Name, user2Name, answersSummary);
          return res.status(200).json(result);
        }
      }

      if (next) {
        next();
      } else {
        res.status(404).json({ error: 'Endpoint not found' });
      }
    } catch (err) {
      console.error('Error handling API route:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // If request already ended before listener attached
  if (req.readableEnded) {
    req.emit('end');
  }
}
