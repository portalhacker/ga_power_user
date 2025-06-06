import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export class GoogleAnalyticsClient {
  private client: AnalyticsAdminServiceClient;

  constructor(tokens: { refresh_token: string; access_token: string }) {
    oAuth2Client.setCredentials(tokens);
    this.client = new AnalyticsAdminServiceClient({
      auth: oAuth2Client as unknown as any,
      fallback: 'rest',
    });
  }

  async listAccountSummaries() {
    try {
      const [accountSummaries] = await this.client.listAccountSummaries();
      return accountSummaries || [];
    } catch (error) {
      console.error('Failed to fetch account summaries', error);
      throw new Error('Failed to fetch account summaries');
    }
  }

  async listAccounts() {
    try {
      const [accounts] = await this.client.listAccounts();
      return accounts || [];
    } catch (error) {
      console.error('Failed to fetch accounts', error);
      throw new Error('Failed to fetch accounts');
    }
  }

  async getAccount(accountId: number) {
    try {
      const [account] = await this.client.getAccount({
        name: `accounts/${accountId}`,
      });
      return account || null;
    } catch (error) {
      console.error(`Failed to fetch account with ID ${accountId}`, error);
      throw new Error(`Failed to fetch account with ID ${accountId}`);
    }
  }

  async listProperties(accountId: number) {
    try {
      const [properties] = await this.client.listProperties({
        filter: `parent:accounts/${accountId}`,
      });
      return properties || [];
    } catch (error) {
      console.error(
        `Failed to fetch properties for account ID ${accountId}`,
        error
      );
      throw new Error(`Failed to fetch properties for account ID ${accountId}`);
    }
  }

  async getProperty(propertyId: number) {
    try {
      const [property] = await this.client.getProperty({
        name: `properties/${propertyId}`,
      });
      return property || null;
    } catch (error) {
      console.error(`Failed to fetch property with ID ${propertyId}`, error);
      throw new Error(`Failed to fetch property with ID ${propertyId}`);
    }
  }

  // async getAllPropertySettings(propertyId: number) {
  //   let results: any = {};
  //   results['property'] = await this.getProperty(propertyId);
  //   if (!results['property']) {
  //     console.error(`Property with ID ${propertyId} not found`);
  //     throw new Error(`Property with ID ${propertyId} not found`);
  //   }
  //   const settings = {
  //     accessBindings: this.client.listAccessBindings,
  //     adSenseLinks: this.client.listAdSenseLinks,
  //     audiences: this.client.listAudiences,
  //     bigQueryLinks: this.client.listBigQueryLinks,
  //     calculatedMetrics: this.client.listCalculatedMetrics,
  //     channelGroups: this.client.listChannelGroups,
  //     customDimensions: this.client.listCustomDimensions,
  //     customMetrics: this.client.listCustomMetrics,
  //     dataRetention: this.client.getDataRetentionSettings,
  //     dataStreams: this.client.listDataStreams,
  //     displayVideo360AdvertiserLinks:
  //       this.client.listDisplayVideo360AdvertiserLinks,
  //     expandedDataSets: this.client.listExpandedDataSets,
  //     firebaseLinks: this.client.listFirebaseLinks,
  //     googleAdsLinks: this.client.listGoogleAdsLinks,
  //     keyEvents: this.client.listKeyEvents,
  //     // reportingDataAnnotations: this.reportingDataAnnotations,
  //     rollupPropertySourceLinks: this.client.listRollupPropertySourceLinks,
  //     searchAds360Links: this.client.listSearchAds360Links,
  //     subpropertyEventFilters: this.client.listSubpropertyEventFilters,
  //   };
  //   let promises: any = {};
  //   for (const [key, method] of Object.entries(settings)) {
  //     promises[key] = method.call(this.client, {
  //       parent: `properties/${propertyId}`,
  //     });
  //   }
  //   try {
  //     const resultsArray = await Promise.allSettled(Object.values(promises));
  //     for (let i = 0; i < resultsArray.length; i++) {
  //       const key = Object.keys(promises)[i];
  //       const result = resultsArray[i];
  //       if (result.status === 'fulfilled') {
  //         results['property'][key] = result.value[0] || [];
  //       }
  //       if (result.status === 'rejected') {
  //         console.error(`Failed to fetch ${key}`, result.reason);
  //         results['property'][key] = null;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching property settings', error);
  //     throw new Error('Error fetching property settings');
  //   }
  //   return results;
  // }
}
