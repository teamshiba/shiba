import axios from "axios";
import { StatisticsStore } from "./statistics-store";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

test("updates items", async () => {
  const statisticsStore = new StatisticsStore();
  const roomId = "1234";
  const roomStatStore = statisticsStore.room(roomId);
  const mockResult = {
    item: {
      name: "mockItem",
      itemId: "item1",
    },
    like: 0,
    dislike: 1,
  };

  mockedAxios.get.mockImplementationOnce(async (path) => {
    expect(path).toContain(`/room/${roomId}/stats`);

    return {
      data: {
        status: "success",
        data: [mockResult],
      },
    };
  });

  await roomStatStore.updateStatistics();
  expect(roomStatStore.statistics).toStrictEqual([mockResult]);
});
