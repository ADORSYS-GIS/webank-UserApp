import type { Storage } from 'redux-persist/es/types';
import type { StorageFactory } from '@adorsys-gis/storage';
import type { WebankDatabase } from '@wua/services/keyManagement/storageSetup.ts';

export class ReduxStorage implements Storage {
  constructor(
    private readonly storage: StorageFactory<WebankDatabase>,
  ) {
  }

  public async getItem(key: string) {
    const retrievedRecord = await this.storage.findOne('redux', key);
    if (!retrievedRecord) {
      return null;
    }

    const { value } = retrievedRecord;
    return value;
  }

  public async setItem(key: string, strValue?: string | null | object) {
    if (!strValue) {
      await this.removeItem(key);
      return;
    }

    const exist = (await this.storage.count('redux', {
      key,
    })) > 0;

    // If strValue is a string, parse it as JSON
    const jsonValue = typeof strValue === 'string' ? JSON.parse(strValue) : strValue;

    if (exist) {
      await this.storage.update('redux', key, jsonValue);
    } else {
      await this.storage.insert('redux', { value: jsonValue, key });
    }
  }

  public async removeItem(key: string) {
    await this.storage.delete('redux', key);
  }
}