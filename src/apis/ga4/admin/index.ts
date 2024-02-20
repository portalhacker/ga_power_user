interface GA4Account {
    name: string;
    displayName: string;
    regionCode: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    properties: GA4Property[];
}
interface GA4Property {
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
}

class BaseAPI {
    public readonly accessToken: string;
    private readonly headers: Headers | undefined;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
        this.headers = new Headers({
            'Authorization': `Bearer ${this.accessToken}`,
            'Application': 'application/json',
        });
    }

    protected async get(route: string, queryParams: URLSearchParams = new URLSearchParams()): Promise<any> {
        const url: string = `${route}?${queryParams.toString()}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers,
            });
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
                method: 'POST',
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
    public basePath: string = '/api/ga4-admin';
}

class GA4AdminBeta extends GA4Admin {
    constructor(accessToken: string) {
        super(accessToken);
        this.basePath = `${this.basePath}/v1beta`;
    }
}

export class GA4AdminClient extends GA4AdminBeta {
    public accounts: GA4Account[] = [];

    constructor(accessToken: string) {
        super(accessToken);
    }

    public async listAccounts(showDeleted: boolean = false): Promise<GA4Account[]> {
        const fullPath = `${this.basePath}/accounts`;
        this.accounts = [];
        const pageToken = '';

        do {
            const queryParams: URLSearchParams = new URLSearchParams({
                'pageSize': '200',
                'pageToken': pageToken,
                'showDeleted': showDeleted.toString(),
            });
            const body = await this.get(fullPath, queryParams);
            this.accounts.push(...body.accounts.map((accountData: GA4Account) => new GA4Account(accountData, this.accessToken)));
        }
        while (pageToken);
        return this.accounts;
    }

    // public async listProperties(accountName: string): Promise<GA4Property[]> {
    //     const queryParams: URLSearchParams = new URLSearchParams({
    //         'filter': `parent:${accountName}`,
    //         'pageSize': '200',
    //     });
    //     const body = await this.get(`${this.baseUrl}/properties`, queryParams);
    //     return body.properties;
    // }
}

class GA4Account extends GA4AdminBeta {
    public name: string;
    public displayName: string;
    public regionCode: string;
    public createTime: string;
    public updateTime: string;
    public deleted: boolean;
    public properties: GA4Property[] = [];

    constructor(data: GA4Account, accessToken: string) {
        super(accessToken);
        this.name = data.name;
        this.displayName = data.displayName;
        this.regionCode = data.regionCode;
        this.createTime = data.createTime;
        this.updateTime = data.updateTime;
        this.deleted = data.deleted;
    }

    public async listProperties(): Promise<GA4Property[]> {
        const queryParams: URLSearchParams = new URLSearchParams({
            'filter': `parent:${this.name}`,
            'pageSize': '200',
        });
        const body = await this.get(`${this.basePath}/properties`, queryParams);
        return this.properties = body.properties.map((propertyData: GA4Property) => new GA4Property(propertyData, this.accessToken));
    }
}

class GA4Property extends GA4AdminBeta {
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

    constructor(data: GA4Property, accessToken: string) {
        super(accessToken);
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
}