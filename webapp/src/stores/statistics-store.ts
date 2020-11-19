import {makeAutoObservable} from "mobx";
import {createContext} from "react";
import {Statistics} from "../domain/statistics";
import {Message, unwrap} from "../domain/message";
import axios from "axios";
import {serverPrefix} from "../common/config";

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
        this.statistics = unwrap((await axios.get<Message<Statistics[]>>(
            `${serverPrefix}/room/${this.roomId}/stats`)).data);
    }

}

export const statisticsStore = new StatisticsStore();

export default createContext(statisticsStore);
