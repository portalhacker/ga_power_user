import { sortArrayByProperty } from "../../../utils";
import {
  GA4ReportRequest,
  GA4ReportResponse,
  apiVersions,
  basePath,
} from "../data";

export interface GA4AccountType {
  id: string;
  name: string;
  displayName: string;
  regionCode: string;
  createTime: string;
  updateTime: string;
  deleted: boolean;
  properties: GA4Property[];
}
export interface GA4PropertyType {
  id: string;
  name: string;
  displayName: string;
  currencyCode: string;
  timeZone: string;
  industryCategory: string;
  propertyType: string;
  serviceLevel: string;
  account: string;
  parent: string;
  createTime: string;
  updateTime: string;
  runReport: (request: GA4ReportRequest) => Promise<GA4ReportResponse>;
  getSessionsYesterday: () => Promise<string | undefined>;
}

class BaseAPI {
  public readonly accessToken: string;
  private readonly headers: Headers | undefined;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.headers = new Headers({
      Authorization: `Bearer ${this.accessToken}`,
      Application: "application/json",
    });
  }

  protected async get(
    route: string,
    queryParams: URLSearchParams = new URLSearchParams()
  ): Promise<any> {
    const url: string = `${route}?${queryParams.toString()}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
      });
      if (response.status === 401) {
        console.error("Access token expired. Please re-authenticate.");
        localStorage.removeItem("google_credentials");
        window.location.reload();
      }
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data from ${url}: ${error}`);
    }
  }

  protected async post(route: string, body: Object): Promise<any> {
    try {
      const response = await fetch(route, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data from ${route}: ${error}`);
    }
  }
}

class GA4Admin extends BaseAPI {
  public basePath: string = "/api/ga4-admin";
}

class GA4AdminBeta extends GA4Admin {
  constructor(accessToken: string) {
    super(accessToken);
    this.basePath = `${this.basePath}/v1beta`;
  }
}

export class GA4AdminClient
  extends GA4AdminBeta
  implements Iterable<GA4Account>
{
  public accounts: GA4Account[] = [];

  constructor(accessToken: string) {
    super(accessToken);
  }
  [Symbol.iterator](): Iterator<GA4Account, any, undefined> {
    let index = 0;
    return {
      next: (): IteratorResult<GA4Account> => {
        if (index < this.accounts.length) {
          return { done: false, value: this.accounts[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  }

  public async listAccounts(
    showDeleted: boolean = false
  ): Promise<GA4Account[]> {
    const fullPath = `${this.basePath}/accounts`;
    this.accounts = [];
    let pageToken = "";

    do {
      const queryParams: URLSearchParams = new URLSearchParams({
        pageSize: "200",
        pageToken: pageToken,
        showDeleted: showDeleted.toString(),
      });
      const body = await this.get(fullPath, queryParams);
      this.accounts.push(
        ...body.accounts.map(
          (accountData: GA4Account) =>
            new GA4Account(accountData, this.accessToken)
        )
      );
      pageToken = body.nextPageToken;
    } while (pageToken);
    return sortArrayByProperty(this.accounts, "displayName") as GA4Account[];
  }
}

class GA4Account extends GA4AdminBeta implements Iterable<GA4Property> {
  public id: string;
  public name: string;
  public displayName: string;
  public regionCode: string;
  public createTime: string;
  public updateTime: string;
  public deleted: boolean;
  public properties: GA4Property[] = [];

  constructor(data: GA4Account, accessToken: string) {
    super(accessToken);
    this.id = data.name.split("/").pop()!;
    this.name = data.name;
    this.displayName = data.displayName;
    this.regionCode = data.regionCode;
    this.createTime = data.createTime;
    this.updateTime = data.updateTime;
    this.deleted = data.deleted;
  }
  [Symbol.iterator](): Iterator<GA4Property, any, undefined> {
    let index = 0;
    return {
      next: (): IteratorResult<GA4Property> => {
        if (index < this.properties.length) {
          return { done: false, value: this.properties[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  }

  public async listProperties(): Promise<GA4Property[]> {
    this.properties = [];
    let pageToken = "";
    do {
      const queryParams: URLSearchParams = new URLSearchParams({
        filter: `parent:${this.name}`,
        pageSize: "200",
      });
      const body = await this.get(`${this.basePath}/properties`, queryParams);
      if (!body.properties) {
        return (this.properties = []);
      }
      this.properties.push(
        ...(sortArrayByProperty(
          body.properties.map(
            (propertyData: any) =>
              new GA4Property(propertyData, this.accessToken)
          ),
          "displayName"
        ) as GA4Property[])
      );
      pageToken = body.nextPageToken;
    } while (pageToken);
    return this.properties;
  }
}

class GA4Property extends GA4AdminBeta {
  public id: string;
  public name: string;
  public displayName: string;
  public currencyCode: string;
  public timeZone: string;
  public industryCategory: string;
  public propertyType: string;
  public serviceLevel: string;
  public account: string;
  public parent: string;
  public createTime: string;
  public updateTime: string;
  public sessionsYesterday: string | undefined;

  constructor(data: GA4Property, accessToken: string) {
    super(accessToken);
    this.id = data.name.split("/").pop()!;
    this.name = data.name;
    this.displayName = data.displayName;
    this.currencyCode = data.currencyCode;
    this.timeZone = data.timeZone;
    this.industryCategory = data.industryCategory;
    this.propertyType = data.propertyType;
    this.serviceLevel = data.serviceLevel;
    this.account = data.account;
    this.parent = data.parent;
    this.createTime = data.createTime;
    this.updateTime = data.updateTime;
  }

  public async runReport(
    request: GA4ReportRequest
  ): Promise<GA4ReportResponse> {
    return await this.post(
      `${basePath}/${apiVersions.v1beta}/${this.name}:runReport`,
      request
    );
  }

  public async getSessionsYesterday(): Promise<string | undefined> {
    const request: GA4ReportRequest = {
      property: this.name,
      dateRanges: [
        {
          startDate: "yesterday",
          endDate: "yesterday",
          name: "yesterday",
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "sessions" }],
    };
    const response: GA4ReportResponse = await this.runReport(request);
    if (!response.metricHeaders) return;
    if (!response.rows) return (this.sessionsYesterday = "0");
    return (this.sessionsYesterday = response.rows[0].metricValues[0].value);
  }
}
