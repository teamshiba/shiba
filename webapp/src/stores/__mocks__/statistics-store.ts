import {makeAutoObservable} from "mobx";
import {Statistics} from "../../domain/statistics";

class StatisticsStore {
    statisticsDetail = new Map<string, StatisticsDetailStore>();

    constructor() {
        makeAutoObservable(this);
    }

    room(id: string): StatisticsDetailStore {
        const store = this.statisticsDetail.get(id)
        if (store) {
            return store;
        }

        const newStore = new StatisticsDetailStore(id);
        this.statisticsDetail.set(id, newStore);
        return newStore;
    }
}

class StatisticsDetailStore {
    statistics: Statistics[] = [];

    constructor(public roomId: string) {
        makeAutoObservable(this);
    }

    async updateStatistics() {
        this.statistics = [{
            item: {
                itemId: "mock1",
                name: "Mock Item 1"
            },
            like: 1,
            dislike: 2,
        }];
    }

}

export const statisticsStore = new StatisticsStore();
