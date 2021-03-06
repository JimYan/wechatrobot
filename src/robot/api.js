const http = require('http');
const https = require('https');
const util = require('./util');
const parseString = require('xml2js').parseString;
const axios = require('axios');

function getTodaysHistory(callBack) {
    const date = new Date();

    http.get("http://api.juheapi.com/japi/toh?v=1.0&month=" + (date.getMonth() + 1) + "&day=" + date.getDate() + "&key=e7be7efcaa9eaaa150fee985a397a40e", function (res) {
        res.setEncoding("utf-8");
        const resData = [];
        res.on("data", function (chunk) {
            resData.push(chunk);
        })
            .on("end", function () {
                const array = JSON.parse(resData.join(""));
                if (array.error_code == 0) {
                    const index = util.rd(0, array.result.length - 1);
                    callBack(array.result[index]);
                }
            });
    })

}

function getTrainTimeList(code, callBack) {
    const api = "http://ws.webxml.com.cn/WebServices/TrainTimeWebService.asmx/getDetailInfoByTrainCode?TrainCode=" + code + "&UserID=";
    http.get(api, function (res) {
        res.setEncoding("utf-8");
        const resData = [];
        res.on("data", function (chunk) {
            resData.push(chunk);
        })
            .on("end", function () {
                const result = resData.join("");
                parseString(result, function (err, result) {
                    console.log(JSON.stringify(result.DataSet['diffgr:diffgram'][0].getDetailInfo));
                    const trainDetailInfo = result.DataSet['diffgr:diffgram'][0].getDetailInfo[0].TrainDetailInfo;
                    if (Array.isArray(trainDetailInfo)) {
                        callBack(true, trainDetailInfo)
                    } else {
                        callBack(false, trainDetailInfo.TrainStation[0])
                    }

                });
            });

    })

}

function getGanHuoImage(callBack) {
    // https://gank.io/api/data/%E7%A6%8F%E5%88%A9/1/668
    const radom = util.rd(0, 668);
    console.log(radom);
    const api = "https://gank.io/api/data/%E7%A6%8F%E5%88%A9/1/" + radom;
    console.log(api);
    axios.get(api).then(response => {
        console.log(response.data.results[0].url);
        callBack(response.data.results[0].url)
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    getTodaysHistory,
    getTrainTimeList,
    getGanHuoImage
};


// http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=手机号
// http://suggest.taobao.com/sug?code=utf-8&q=商品关键字&callback=cb   淘宝商品搜索建议
