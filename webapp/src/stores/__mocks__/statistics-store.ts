import { makeAutoObservable } from "mobx";
import { Statistics } from "../../domain/statistics";
import { getOrCreate } from "../../common/utils";
import { VotingItem } from "../../domain/voting-item";

class StatisticsStore {
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
    this.statistics = [
      {
        items: {
          itemId: "mock1",
          name: "Mock Item 1",
          itemURL: "https://example.com/test-item",
        } as VotingItem,
        like: 1,
        dislike: 2,
      },
    ];
  }
}

export const statisticsStore = new StatisticsStore();
