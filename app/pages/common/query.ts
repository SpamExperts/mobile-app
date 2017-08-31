export class Query {
    public filters: any[] = [];
    private fields: any[] = [];
    private orderBy: any[] =[];
    private count: boolean = false;

    public filterBy(name: string, op: string, val: string | number | string[] | number[]) {
        if(op == 'is_null') {
            this.filters.push({name: name, op: op});
        } else {
            this.filters.push({name: name, op: op, val: val});
        }

        return this.filters;
    }

    public andFilters(filters){
        this.filters.push({and: filters})
        return this;
    }

    public orFilters(filters){
        this.filters.push({or: filters})
        return this;
    }

    public filterEquals(name: string, val: string|number) {
        return this.filterBy(name, '==', val);
    }

    public filtersNotEmpty(): boolean {
        return this.filters.length > 0;
    }

    public filterIsNull(name: string) {
        return this.filterBy(name, 'is_null', null);
    }

    public toArrayFilters() {
        return this.filters.slice(0);
    }

    public getFields(): any[] {
        return this.fields;
    }

    public getOrderBy(): any[] {
        return this.orderBy;
    }

    public getCount(): boolean {
        return this.count;
    }

    public getQueryFilters(): any[] {
        return this.filters;
    }

    private addField(field: any): Query {
        this.fields.push(field.field ? field : {field: field});
        return this;
    }

    public addFields(fields: string[]): Query {
        if (fields.length) {
            fields.forEach((field: string) => {
                this.addField(field);
            })
        }
        return this;
    }

    public addOrderBy(field: string, direction: string): Query {
        this.orderBy.push({"field": field, "direction": direction});
        return this;
    }

    public addCount(count: boolean): Query {
        this.count = count;
        return this;
    }

    public toArray(): any {
        let query = {};

        if (this.filters && this.filtersNotEmpty()) {
            query['filters'] = this.toArrayFilters();
        }

        if (this.fields && this.fields.length > 0) {
            query['fields'] = this.fields;
        }

        if (this.orderBy && this.orderBy.length > 0) {
            query['order_by'] = this.orderBy;
        }

        query['count'] = this.count;

        return query;
    }

    public isNotEmpty(): boolean {
        let obj = this.toArray();
        for (let key of Object.keys(obj)) {
            if(obj[key].length)
                return true;
        }
        return false;
    }

    public createQuery(
        filters: any[],
        fields: any[],
        orderBy: string,
        count: boolean = false
    ): Query {

        let query = new Query();

        query.andFilters(filters);
        query.addFields(fields);
        if(orderBy) {
            query.addOrderBy(orderBy, 'asc');
        }
        query.addCount(count);

        return query;
    }

    public createRemoveQuery(
        filters: any
    ): Query {

        let query = new Query();
        delete query['fields']; delete query['orderBy']; delete query['count'];

        query.orFilters(filters);

        return query;
    }
}