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
        // this.statistics = unwrap((await axios.get<Message<Statistics[]>>(
        //     `${serverPrefix}/room/${this.roomId}/stats`)).data);

        // For testing purpose
        this.statistics = [
            {
                "like": 1,
                "dislike" : 2,
                "item": {
                  "name": "Ginza Kyubey", "itemId":  "1"
                }
            },
            {
                "like": 4,
                "dislike" : 0,
                "item": {
                  "name": "The MOON", "itemId":  "2"
                }
            }
        ]
    }

}

export const statisticsStore = new StatisticsStore();

export default createContext(statisticsStore);
