import axios from 'axios';
import {GroupStore} from "./group-store";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function mockGetRoom<T>(room: T, subPath: string) {
    mockedAxios.get.mockImplementationOnce(async (path) => {
        expect(path).toContain(subPath);

        return {
            data: {
                status: "success",
                data: room,
            }
        }
    });
}

test("update active groups", async () => {
    const groupStore = new GroupStore();
    const mockGroup = {
        groupId: "groupId1",
        roomName: "Test Group 1",
        isCompleted: false,
        members: [],
    };

    mockGetRoom([mockGroup], "");

    await groupStore.updateActiveGroups();
    expect(groupStore.activeGroups).toStrictEqual([mockGroup]);
})

test("update history groups", async () => {
    const groupStore = new GroupStore();
    const mockGroup = {
        groupId: "groupId1",
        roomName: "Test Group 1",
        isCompleted: true,
        members: [],
    };

    mockGetRoom([mockGroup], "");

    await groupStore.updateHistoryGroups();
    expect(groupStore.historyGroups).toStrictEqual([mockGroup]);
})

test("create group", async () => {
    const groupStore = new GroupStore();

    const memory: { roomName: string }[] = [];

    mockGetRoom(memory, "")

    mockedAxios.post.mockImplementationOnce(async (_, data) => {
        memory.push(data as { roomName: string });
    });

    await groupStore.createGroup("Test Group");

    expect(groupStore.activeGroups).toStrictEqual([{roomName: "Test Group"}]);
})

test("get room profile", async () => {
    const groupStore = new GroupStore();
    const id = "1234";
    const groupProfileStore = groupStore.room(id);
    const mockGroup = {
        groupId: id,
    }

    mockGetRoom(mockGroup, `/room/${id}`);

    await groupProfileStore.update();
    expect(groupProfileStore.data).toStrictEqual(mockGroup);
})

test("update room name", async () => {
    const groupStore = new GroupStore();
    const id = "1234";
    const groupProfileStore = groupStore.room(id);
    const mockGroup = {
        groupId: id,
        roomName: "Old Name",
    }

    mockedAxios.put.mockImplementationOnce(async (path, data) => {
        expect(path).toContain(`/room/${id}`);
        mockGroup.roomName = data.roomName;
    });

    mockGetRoom(mockGroup, `/room/${id}`);

    await groupProfileStore.setGroupName("New Name");
    expect(groupProfileStore.data?.roomName).toStrictEqual("New Name");
})

test("join room", async () => {
    const groupStore = new GroupStore();
    const id = "1234";
    const groupProfileStore = groupStore.room(id);
    const mockGroup = {
        groupId: id,
        members: ["user1"]
    }

    mockedAxios.put.mockImplementationOnce(async (path) => {
        expect(path).toContain(`/room/${id}/member`);
        mockGroup.members.push("user2");
    });

    mockGetRoom(mockGroup, `/room/${id}`);

    await groupProfileStore.join();
    expect(groupProfileStore.data?.members).toStrictEqual(["user1", "user2"]);
})

test("end match", async () => {
    const groupStore = new GroupStore();
    const id = "1234";
    const groupProfileStore = groupStore.room(id);
    const mockGroup = {
        groupId: id,
        isCompleted: false,
    }

    mockedAxios.put.mockImplementationOnce(async (path, data) => {
        expect(path).toContain(`/room/${id}`);
        mockGroup.isCompleted = data.isCompleted;
    });

    mockGetRoom(mockGroup, `/room/${id}`);

    await groupProfileStore.endMatch();
    expect(groupProfileStore.data?.isCompleted).toBe(true);
})
