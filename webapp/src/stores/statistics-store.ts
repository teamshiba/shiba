import { makeAutoObservable } from "mobx";
import { Statistics } from "../domain/statistics";
import { Message, unwrap } from "../domain/message";
import axios from "axios";
import { serverPrefix } from "../common/config";
import { getOrCreate } from "../common/utils";

export class StatisticsStore {
  statisticsDetail = new Map<string, StatisticsDetailStore>();

  constructor() {
    makeAutoObservable(this);
  }

  room(id: string): StatisticsDetailStore {
    return getOrCreate(
      this.statisticsDetail,
      id,
      (id) => new StatisticsDetailStore(id)
    );
  }
}

class StatisticsDetailStore {
  statistics: Statistics[] = [];

  constructor(public roomId: string) {
    makeAutoObservable(this);
  }

  async updateStatistics() {
    this.statistics = unwrap(
      (
        await axios.get<Message<Statistics[]>>(
          `${serverPrefix}/room/${this.roomId}/stats`
        )
      ).data
    );
  }
}

export const statisticsStore = new StatisticsStore();
