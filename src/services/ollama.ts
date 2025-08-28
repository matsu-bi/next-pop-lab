const http = require('http');

function ollamaGenerate(model: string, prompt: string, temperature: number = 0.2): Promise<string> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: temperature
      }
    });

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res: any) => {
      let responseData = '';

      res.on('data', (chunk: string) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          if (jsonResponse.response) {
            resolve(jsonResponse.response);
          } else {
            console.error('Ollamaからの応答が期待される形式ではありません');
            reject(new Error('Invalid response format from Ollama'));
          }
        } catch (error) {
          console.error('Ollama応答の解析に失敗しました:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error: Error) => {
      console.error('Ollama API呼び出しでエラーが発生しました:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

module.exports = {
  ollamaGenerate
};
