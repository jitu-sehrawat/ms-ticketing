import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before Connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clinetId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clinetId, { url });
  
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this.client.on('error', (error) => {
        reject(error);
      });
    });  
  };
}

export const natsWrapper = new NatsWrapper();