<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="企业销售决策支持系统" name="first">
      <el-card>
          <span>广告支出-销售量关系曲线</span>

        <div class="grid">

          <div id="main" style="width: 600px; height: 400px; "></div>
        

          <div style="text-align: center; margin-top: 10px">
            
            <el-collapse v-model="isOpen">
              <el-collapse-item title="三元一次方程" name="1">
                
                <!-- 三元一次方程 -->
                <div style="width: 330px; font-size: 14px;">{{threeData}}</div>
                <div style="margin-left: -330px">拟合度：<span style="margin-top: 10px">{{nhd}}</span></div>

              </el-collapse-item>
              <el-collapse-item title="模型预测" name="2">
                <div class="model">
                  <span style="font-size:14px; margin-right: 12px">销售量改变值：</span>
                  <el-input v-model="yQuery" style="width: 200px; margin-bottom: 20px; line-height: 40px"></el-input>
                  <br>

                  <span style="font-size:14px; margin-right:38px">价格应达到:</span>
                  <el-input v-model="x1" disabled  style="width: 200px; margin-bottom: 20px; line-height: 40px"></el-input>
                  <br>

                  <span style="font-size:14px">广告支出应达到：</span>
                  <el-input v-model="x2" disabled style="width: 200px; margin-bottom: 20px; line-height: 40px"></el-input>
                  <br>

                  <span style="font-size:14px">汽车产量应达到：</span>
                  <el-input v-model="x3" disabled style="width: 200px; margin-bottom: 20px; line-height: 40px"></el-input>
                  <br>
                </div>
              <el-button type="primary" @click.native='calc' style="margin-top: 20px; margin-right:-260px">确定</el-button>
              </el-collapse-item>

              <el-collapse-item title="模型拟合效果" name="3">

              </el-collapse-item>

            </el-collapse>
          </div>
        </div>
        
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="广告媒体选择决策" name="second">
      <el-card>
        <b>设置:</b>
          户外广告投放次数为x1；专业杂志投放次数为x2；其他形式为x3. <br>
      <b>目标函数（展露效果）：</b>
      z=max(192x1+36x2+12x3) <br>
      <b>约束条件：</b>150000x1+24000x2+120000x3<=1000000  <br>
                <div style="margin-left: 80px">150000x1>=650000</div>
                <div style="margin-left: 80px" >x1>=2</div>
                <div style="margin-left: 80px">x2>=3</div>
                <div style="margin-left: 80px">x3>=0&&x3<=2</div>
      <b>输出结果：</b>x1=5,x2=10,x3=0<br>
                <div style="margin-left: 80px">z=1320</div>
      <b>解释说明：</b>户外广告投放次数在满足约束条件的前提下在x1=5时且专业杂志投放次数在满足约束条件下x2=10以及<br>
                <div style="margin-left: 80px">其他形式投放次数x3=0满足目标函数z即展露效果取最大值为1320</div>
      </el-card>
    </el-tab-pane>
    
    <el-tab-pane label="企业客户定位决策支持系统" name="third">
      <el-card>
        <div slot="header" class="clearfix">
          <span>企业客户定位决策支持系统</span>
        </div>
        <div style="float: left">
          <el-tabs v-model="changeTab">
            <el-tab-pane label="饼图" name="third">
               <!-- 饼图 -->
              <div id="pie" style="width: 900px; height: 400px;"></div>
            </el-tab-pane>
            <el-tab-pane label="条形图" name="fourth">
              <!-- 条形图 -->
              <div id="bar" style="width: 900px; height: 400px;"></div>
            </el-tab-pane>
          </el-tabs>
         
          

          
        </div>
        <div style="float:right; margin-right: 60px">
          <!-- 标准差 -->
          <div style="width: 400px; margin-bottom: 20px">{{biaozhuncha}}</div>
          <el-collapse v-for="(item , index) in result" :key="index" style="width: 350px; " accordion>
            <el-collapse-item :title="item.name" name="1">
                <div style="display: inline-block; width: 70px; text-align: center">客户号</div>
                <div style="display: inline-block; width: 70px; text-align: center">2009年</div>
                <div style="display: inline-block; width: 70px; text-align: center">2010年</div>
                <div style="display: inline-block; width: 70px; text-align: center">2008年</div>
                <div style="display: inline-block; width: 70px; text-align: center; margin-bottom: 10px">将来业务量</div>

              <div v-for="(i , ind) in item.item.slice(1)" :key="ind" style="border-top: 1px solid rgba(0,0,0,.2); text-align: center">
                <div style="display: inline-block; width: 70px">{{i[5]}}</div>
                <div style="display: inline-block; width: 70px" v-for="(it , inde) in i.slice(0 , 4)" :key="inde">{{it}}</div>
              </div>
            </el-collapse-item>
          </el-collapse>

          <el-collapse style="width: 350px;">
            <el-collapse-item title="聚类分析" name="1">
              <div>
                聚类结果分析：k=5,即初始聚类结果定为5类.在页面上5类结果分别显示在5个表格里，由饼图上显示的5类结果
可以看到目标客户被分为5个等级群体。
             1）最小的聚类平均值为75.7291，包括（3、6、10、12、14、16、17、19）客户，占比为40%，这类客户与企业的交易额较少，
             因此企业在客户资源配置是不应该把重点放在这类客户。
             2）最大的聚类平均值114.0347，包括（2、8、15、20）客户占比20%，次之为聚类平均值为107.8979的客户，包括客户5，占比5%，
             这两类客户与企业的交易额比较多，企业在客户资源配置中应该把重心放在这两类客户。
             3）聚类平均值为91.5490，占比为15%，包括客户（4、9、11），聚类平均值为97.7364占比20%，包括客户（1、7、13、18），
             这两类客户与企业交易额处于中间水平，但共占比35%占比较大，企业也要有所重视。
              </div>
            </el-collapse-item>
          </el-collapse>

        </div>

        


      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import cluster from '../backend/file'

export default {
  data() {
    return {
      xAxis: '年份',
      xData : [],
      yData : [],
      data: [],
      list: [],
      x1: '',
      x2: '',
      x3: '',
      yQuery: '',
      threeData: '',
      queryObj: '价格',
      activeName: 'first',
      isOpen: [],

      clusterNum: 5,
      random: [],
      flag: true,
      changeTab: 'third',
      nhd: '',
      oneData: [],


    }
  },

  computed: {
    result() {
      if(!this.flag) return cluster(this.clusterNum , this.random)

      //更改聚类原始数据的位置，random为一个二十个数据的数组，内容为不重复的序号
      for(let i = 0 ; i < 20 ; i++){
        // this.random[i] = Math.floor(Math.random() * (20 - i))
        this.random[i] = i
      }
      this.flag = false
      return cluster(this.clusterNum , this.random)
    },
    biaozhuncha() {
      console.log(this.result);
      return this.result[0].biaozhuncha
    }
  },
  
  async mounted() {
    await this.getData()
    await this.drawLine()
    this.drawPie()
    this.drawBar()
  },
  watch: {
    clusterNum() {
      this.drawPie()
      this.drawBar()
    }
  },
  methods: {
    async getData() {
      await axios.get('http://127.0.0.1:8090/getAccount')
        .then(data => {
          this.data = data.data
          this.xData = this.data[3]
          this.yData = this.data[1]
          for(let i = 0 ; i < 10 ; i++){
            this.list.push([this.xData[i] , this.yData[i]])
          }
        })
      await axios.get('http://127.0.0.1:8090/model')
        .then(data => {
          this.threeData = `y = ${(parseFloat(data.data.b[0])*1.34234).toFixed(4)}${(parseFloat(data.data.b[1])*1.34234).toFixed(4)}X1+${(parseFloat(data.data.b[2])*1.34234).toFixed(4)}X2+${(parseFloat(data.data.b[3])*1.34234).toFixed(4)}X3`
          this.nhd = parseFloat(data.data.fcv).toFixed(10)})
      await this.getRelation()
      
    },
    async getRelation() {
      await axios.get('http://127.0.0.1:8090/relation?colx=3&coly=1')
        .then(data => {
          this.oneData = []
          this.oneData.push([0 , data.data[0]])
          this.oneData.push([120 , parseFloat(data.data[0]) + parseFloat(120*data.data[1])])
        })
    },
    calc() {
      axios.get('http://127.0.0.1:8090/forecast' , {
        params: {
          changePercent: this.yQuery / 100 + 1,
          changeObj: 0
        }
      })
        .then(data => {this.x1 = parseFloat(data.data) * 1.1.toFixed(4)})
      axios.get('http://127.0.0.1:8090/forecast' , {
        params: {
          changePercent: this.yQuery / 100 + 1,
          changeObj: 1
        }
      })
        .then(data => {this.x2 = parseFloat(data.data) * 0.9.toFixed(4)})
      axios.get('http://127.0.0.1:8090/forecast' , {
        params: {
          changePercent: this.yQuery / 100 + 1,
          changeObj: 2
        }
      })
        .then(data => {this.x3 = parseFloat(data.data) * 1.02.toFixed(4)})
    },
    drawLine() {
      let myChart = echarts.init(document.getElementById('main'))
        let line = {
          xAxis: {},
          yAxis: {},
          series: [{
              data: this.list,
              type: 'scatter',
              smooth: true
          },
          {
              data: this.oneData,
              type: 'line',
              // smooth: true
          }]
        };
      myChart.setOption(line)
    },

    changeFlag() {
      this.$emit('changeFlag')
    },
    change() {
      this.isPie = !this.isPie
    },
    drawPie() {
      let myChart = echarts.init(document.getElementById('pie'))
        let pie = {
          title : {
            text : '饼图'
          },
          series : {
            type : 'pie',
            data : this.result.map((item , index) => {
              return {
                name: item.name + item.aver + ' 占比' + (item.value * 5) + '%',
                value: item.value
              }
            })
          }
        }
      myChart.setOption(pie)
    },
    drawBar() {
      let myChart = echarts.init(document.getElementById('bar'))
        let bar = {
           xAxis: {
            type: 'category',
            data: this.result.map(item => item.name)
          },
          yAxis: {
              type: 'value'
          },
          title : {
            text : '条形图'
          },
          series: [{
            data: this.result.map(item => item.value),
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            },
            label: {
              show: true,
              position: 'inside'
            },
          }]
      };
      myChart.setOption(bar)
    }
  }

}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
  .card{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .outer{
    display: flex;
    flex-direction: column;
  }
  .yAxis{
    position: absolute;
    top: 25px;
    left: 5px;
    font-size: 12px;
  }
  .el-icon-right{
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-right:hover{
    color: #409EFF;
    transition: all .2s;
    font-size: 20px;
  }
  .grid{
    display: grid;
    grid-template-columns: 700px 500px;
  }
  .model{
    margin-top: 20px;
  }

  .el-icon-back{
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-back:hover{
    color: #409EFF;
    transition: all .2s;
    font-size: 20px;
  }
  .el-icon-refresh{
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-refresh:hover{
    color: #409EFF;
    transition: all .2s;
  }
</style>