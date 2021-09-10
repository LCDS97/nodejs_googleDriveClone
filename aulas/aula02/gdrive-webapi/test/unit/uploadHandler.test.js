import {
    describe,
    test,
    expect,
    beforeEach,
    jest
} from "@jest/globals";
import fs from 'fs';
import { pipeline } from 'stream/promises'
import { resolve } from 'path';
import { logger } from '../../src/logger.js'
import Routes from "../../src/routes.js";
import UploadHandler from "../../src/uploadHandler.js";
import TestUtil from "../_util/testUtil.js";

describe('#UploadHandler test suite', () => {

    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => { }
    };
    beforeEach(() => {
        jest.spyOn(logger, 'info')
            .mockImplementation()
    })

    describe('#registerEvents', () => {
        test('should call onFile and onFinish functions on Busboy instance', () => {
            const uploadHandler = new UploadHandler({
                io: ioObj,
                socketId: '01',
                
            })

            jest.spyOn(uploadHandler, uploadHandler.onFile.name)
                .mockResolvedValue()

            const headers = {
                'content-type': 'multipart/form-data; boundary='
            }

            const onFinish = jest.fn();
            const busboyInstance = uploadHandler.registerEvents(headers, onFinish)

            const fileStream = TestUtil.generateReadableStream(['chunk', 'of', 'data'])
            busboyInstance.emit('file', 'fieldname', fileStream, 'filename.txt')

            busboyInstance.listeners("finish")[0].call()

            expect(uploadHandler.onFile).toHaveBeenCalled()
            expect(onFinish).toHaveBeenCalled()
        })
    })

    describe('#onFile', () => {
        test('given a stream file it should save it on disk', async () => {
            const chunks = ['hey', 'dude']
            const downloadsFolder = '/tmp'
            const handler = new UploadHandler({
                io: ioObj,
                socketId: '01',
                downloadsFolder
            })

            const onData = jest.fn()

            jest.spyOn(fs, fs.createWriteStream.name)
                .mockImplementation(() => TestUtil.generateWritableStream(onData))

            const onTransform = jest.fn()
            jest.spyOn(handler, handler.handleFileBytes.name)
                .mockImplementation(() => TestUtil.generateTransformStream(onTransform))

            const params = {
                fieldname: 'video',
                file: TestUtil.generateReadableStream(chunks),
                filename: 'mockFile.mov'
            }

            await handler.onFile(...Object.values(params))

            expect(onData.mock.calls.join()).toEqual(chunks.join())
            expect(onTransform.mock.calls.join()).toEqual(chunks.join())

            const expectedFileName = handler.downloadsFolder.concat('/' + params.filename)
            expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFileName)
        })
    })

    describe('#handleFileBytes', () => {
        test('should call emit function and it is a transform stream', async () => {

            jest.spyOn(ioObj, ioObj.to.name)
            jest.spyOn(ioObj, ioObj.emit.name)

            const handler = new UploadHandler({
                io: ioObj,
                socketId: '01'
            })

            jest.spyOn(handler, handler.canExecute.name)
                .mockReturnValueOnce(true)

            const messages = ['hello']
            const source = TestUtil.generateReadableStream(messages)
            const onWrite = jest.fn()
            const target = TestUtil.generateWritableStream(onWrite)

            await pipeline(
                source,
                handler.handleFileBytes("filename.txt"),
                target
            )

            expect(ioObj.to).toHaveBeenCalledTimes(messages.length)
            expect(ioObj.emit).toHaveBeenCalledTimes(messages.length)

            // Se o handleFileBytes for um transform stream, nosso pipeline vai continuar o processo, passando os dados pra frente e chamar nossa função target a cada chunk
            expect(onWrite).toBeCalledTimes(messages.length)
            expect(onWrite.mock.calls.join()).toEqual(messages.join())

        })
    })

    describe('#canExecute', () => {

        test('should return true when time is later than specified delay', () => {
            const timerDelay = 1000
            const uploadHandler = new UploadHandler({
                io: {},
                socketId: '',
                messageTimeDelay: timerDelay
    
            })
            const tickNow = TestUtil.getTimeFromDate('2021-07-01 00:00:03')
            TestUtil.mockDateNow([tickNow])

            const lastExecution = TestUtil.getTimeFromDate('2021-07-01 00:00:00')



            const result = uploadHandler.canExecute(lastExecution)
            expect(result).toBeTruthy()
        })

        test('should return false when time inst later than specified delay', () => {
            const timerDelay = 3000
            const uploadHandler = new UploadHandler({
                io: {},
                socketId: '',
                messageTimeDelay: timerDelay
    
            })
            const now = TestUtil.getTimeFromDate('2021-07-01 00:00:02')
            TestUtil.mockDateNow([now])

            const lastExecution = TestUtil.getTimeFromDate('2021-07-01 00:00:01')

            const result = uploadHandler.canExecute(lastExecution)
            expect(result).toBeFalsy()
        })

    })

})