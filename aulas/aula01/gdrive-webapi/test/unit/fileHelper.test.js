import {
    describe,
    test,
    expect,
    jest
} from "@jest/globals";

import fs from 'fs'
import FileHelper from "../../src/fileHelper.js";

import Routes from "../../src/routes.js";

describe("#FileHelper", () => {
    describe("#getFilesStatus", () => {
        test("it should return file statuses in correct format", async () => {

            const statMock =
                {
                    dev: 1854149141,
                    mode: 33206,
                    nlink: 1,
                    uid: 0,
                    gid: 0,
                    rdev: 0,
                    blksize: 4096,
                    ino: 12384898975551216,
                    size: 167531,
                    blocks: 328,
                    atimeMs: 1631144551557.4038,
                    mtimeMs: 1630617117941.6118,
                    ctimeMs: 1631144528862.1882,
                    birthtimeMs: 1631144521340.0352,
                    atime: '2021-09-08T23:42:31.557Z',
                    mtime: '2021-09-02T21:11:57.942Z',
                    ctime: '2021-09-08T23:42:08.862Z',
                    birthtime: '2021-09-08T23:42:01.340Z'
                }

                const mockUser = 'lucassantos'
                process.env.USER = mockUser

                const filename = 'foto.png'

                jest.spyOn(fs.promises, fs.promises.readdir.name)
                    .mockResolvedValue([filename])

                jest.spyOn(fs.promises, fs.promises.stat.name)
                    .mockResolvedValue(statMock)

                const result = await FileHelper.getFilesStatus("/tmp")
                
    

            const expectedResult = [
                {
                size: '163 kb',
                birthtime: statMock.birthtime,
                owner: mockUser,
                file: filename
            }
        ]

        expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
        expect(result).toMatchObject(expectedResult)

        })
    })
})