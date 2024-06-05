import axios from 'axios';
import { AuthenticationPayloadV2 } from './AppModel';

export class ApiManager {
  async getSessionData(url: string): Promise<AuthenticationPayloadV2 | null> {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.get(url, { headers });
      if (response.status === 200) {
        return AuthenticationPayloadV2.fromJson(response.data);
      } else {
        console.error(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Exception:', error);
    }
    return null;
  }
}
