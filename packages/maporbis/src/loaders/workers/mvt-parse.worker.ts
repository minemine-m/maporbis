import { MVTParser } from "../parsers/mvt-parser";

// Define Worker Message Type
// 定义Worker消息类型
type MessageType = {
    arrayBuffer: ArrayBuffer;
    x: number;
    y: number;
    z: number;
};

self.onmessage = async (msg: MessageEvent<MessageType>) => {
    const data = msg.data;
    
    try {
        // Execute time-consuming parsing and coordinate transformation in Worker thread
        // 在Worker线程中执行耗时的解析和坐标转换
        const vectorData = await MVTParser.parse(data.arrayBuffer, data.x, data.y, data.z);
        
        // Return parsed data to main thread
        // 将解析后的数据返回给主线程
        // vectorData is an object, usually non-Transferable, no second argument needed
        // vectorData 是一个对象，通常是非 Transferable 的，不需要第二个参数
        self.postMessage(vectorData); 
        
    } catch (error) {
        console.error("Worker MVT Parse Failed:", error);
        // Return error message
        // 返回错误信息
        self.postMessage({ error: (error as Error).message });
    }
};
