import { getPersonality, gpt } from '../utils/getdate.js';
import setting from "../model/setting.js";

export class greetings extends plugin {
    constructor() {
        super({
            name: "[鸢尾花插件]ai对话",
            event: "message",
            priority: 5001,
            rule: [
                {
                    reg: '^#(ai|AI|Ai)',
                    fnc: '回答',
                },
            ]
        });
    }

    get appconfig() {
        return setting.getConfig("Customize");
    }

    get GPTconfig() {
        return setting.getConfig("GPTconfig");
    }

    async 回答(e) {

        if (!this.GPTconfig.GPTKey) {
            return false;
        }

        if (!e.msg) {
            return false;
        }

        let arr2 = [{ "role": "user", "content": `${e.name}说：${e.msg}` }];
        let gptmsgInitial = await getPersonality();
        let gptmsg = [...gptmsgInitial, ...arr2];

        const content = await gpt(gptmsg);

        if (content == true) {
            logger.info('[ai回答]key或url配置错误，');
            return false;
        }

        const noBracket = /^[^【】《》（）(){}[\]<>]+$/;
        let sentences;
        if (typeof content === 'string') {
            if (noBracket.test(content)) {
                sentences = content.split(/(?<=[。！?;；:：])/g);
            } else {
                sentences = [content];
            }
        } else {
            logger.info('未获取到内容', content);
        }

        for (let index = 0; index < sentences.length; index++) {
            if (index === 0) {
                await new Promise(resolve => setTimeout(resolve, Math.random() * (10000 - 3000)));
                e.reply(sentences[index], true);
            } else {
                await new Promise(resolve => setTimeout(resolve, Math.random() * (5000 - 3000)));
                e.reply(sentences[index]);
            }
        }

        return true;
    }
}