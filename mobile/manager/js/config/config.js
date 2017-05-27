//添加webkit/blink内核兼容
$(document).bind('mobileinit',function(){
    $.mobile.changePage.defaults.changeHash = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
});

(function(namespace) {
		
		'use strict';
		
		namespace.chintBodyMain = $('#chintBodyMain') ;
		namespace.modifyPanel = $("#modifyPanel") ;
		namespace.modifyInner = modifyPanel.find(".ui-panel-inner") ;
		namespace.filterPanel = $("#filterPanel") ;
		namespace.filterInner = filterPanel.find(".ui-panel-inner") ;
		namespace.popup = $("#modifyPopup") ;
		namespace.loading = $("#loading-modal") ;
		
		//配置action路径
		var config = {};
		//配置json路径
		var jsonConfig = {} ;
		
		var configMap = {
			'dev': config	,
			'json' : jsonConfig
		}
		
		//添加主路径
		config.basePath = window.location.toString().substr(0, window.location.toString().indexOf('GIMS')+5); //地址格式：http://ip:port/GIMS/
		
		//*******************静态资源*****************
		//添加图片路径
		config.imgPath = '/GIMS/view/mobile/manager/img/' ;
		
		//添加json数据路径
		config.jsonPath = 'view/mobile/manager/data/' ;
		
		//营业厅图片
		config.organon = 'organon.png' ;
		
		//添加模块主路径
		config.modulePath = '/GIMS/view/mobile/manager/js/modules' ;
		
		//登录页路径
		config.loginPage = 'view/mobile/login.html' ;
		
		//主页路径
		config.mainPage = 'view/mobile/index.html' ;
		
		//baidu Map路径
		config.baiduMap = 'http://api.map.baidu.com/getscript?v=1.4' ;
		
		//baidu Map地图中心点坐标
		config.longitude = '120.152272' ; //经度
		config.latitude = '30.261528' ; //纬度
		//**********************************************
		
		//************serverlet API 目录**************
		//公用----登录用户检查
		config.checkUser = 'checkuser.do' ;
		
		//公用----退出
		config.qiutLogout = 'mobileLogout.do' ;
		
		//公用----修改密码
		config.modifyPwd = 'modifyPwd.do' ;
		
		//公用----获取session数据
		config.getSessionStorage = 'getSessionStorage.do' ;
		
		//获取菜单树
		config.menuTreeLists = config.jsonPath+"menuTreeList.json" ;//"mobile.do" ;
		
		//获取所有非空菜单树
		config.getMenuTreeNoEmptys = "sysTblsysmenu/getMenuTreeNoEmpty.do" ;
		
		//正泰主页----最新报警
		config.newAlerts = 'gasTblalert/searchAlert.do' ;
		
		//正泰主页----最新动态
		config.newestActions = 'issueTblnews/dataList.do' ;
		
		//正泰主页----用气概况
		config.gasProfiles = 'gasReport/getGasAnalysisDataByHomepage.do' ;
		
		//正泰主页----年度用气概况
		config.annualGasProfiles = 'gasReport/getGasAnalysisDataByHomepage.do' ;
		
		//正泰主页----逐月收费额分析
		config.draftedByMonths = 'gasAnalysis/getGasMonthDataByHomepage.do' ;
		
		//正泰主页----区域收费额分析
		config.areaTollAnalyzes = 'gasAnalysis/getGasZoneDataByHomepage.do' ;
		
		//正泰主页----获取用户概况信息路径
		config.analysisData = 'gasReport/getGasAnalysisDataByHomepage.do' ;
		
		//*******************营收管理*************************
		//账户开户----根据区域查询设备
		config.searchDeviceByZone = 'gasTblcustomer/searchDeviceByZone.do' ;
		
		//账户开户----证件类型		params : showEmptyNode=0&keyId=
		config.getPidcardTree = 'gasTblcustomer/getPidcardTree.do' ;
		
		//账户开户----用户类型 		params : showEmptyNode=0&keyId=
		config.getTypeCodeTree = 'gasTblcustomer/getTypeCodeTree.do' ;
		
		//账户开户----查询设备具体信息 params : deviceid
		config.deviceDetail = 'gasTblcustomer/deviceDetail.do' ;
		
		//账户开户----获取户号信息 params : {}
		config.getAccountNo = 'gasTblcustomer/getAccountNo.do' ;
		
		//账户开户----保存账户信息
		config.addInfo = 'gasTblcustomer/addInfo.do' ;
		
		//账户管理----获取账户信息		params : zoneid=''
		config.accountInfoDataList = 'gasTblcustomer/dataList.do' ;
		
		//账户管理----保存账户信息		
		config.accountInfoSave = 'gasTblcustomer/save.do' ;
		
		//账户管理----过户		
		config.accountInfoTransfer = 'gasTblcustomer/transfer.do' ;
		
		//账户管理----停户	
		config.stopCustomer = 'gasTblcustomer/stopCustomer.do' ;
		
		//账户管理----启户
		config.startCustomer = 'gasTblcustomer/startCustomer.do' ;
		
		//账户管理----销户
		config.cancelCustomer = 'gasTblcustomer/cancelCustomer.do' ;
		
		//账户管理----换表			? params : zoneID	deviceID	accountID
		config.changeDevice = 'gasTblcustomer/changeDevice.do' ;
		
		//账户管理----换表确认
		config.changeDeviceConfirm = 'gasTblcustomer/changeDeviceConfirm.do' ;
		
		//账户管理----用户细节信息		params : deviceid
		config.customerDetail = 'gasTblcustomer/customerDetail.do' ;
		
		//IC卡管理----获取IC卡信息			params : userID
		config.gasTblcardDataList = 'gasTblcard/dataList.do' ;
		
		//IC卡管理----发卡		params : accountID  deviceID
		config.gasTblcardUserCard = 'gasTblcard/userCard.do' ;
		
		//IC卡管理----挂失/解挂
		config.lossReport = 'gasTblcard/lossReport.do' ;
		
		//充值缴费----获取账户信息
		config.dataListPay = 'gasTblcustomer/dataListPay.do' ;
		
		//充值缴费----获取气量表价格			accountid		deviceid
		config.getGasMeterPrice = 'gasTblcustomer/getPrice.do' ;
		
		//充值缴费----获取付款id
		config.getAccountPayId ='gasTblcustomer/getPayId.do' ;
		
		//充值缴费----计算金额表用气价格			params : deviceid transmoney gasamount
		config.calculateGasMoney = 'gasTblcustomer/calculateGasMoney.do' ;
		
		//充值缴费----付费缴费
		config.saveBalance = 'gasTblcustomer/saveBalance.do' ;
		
		//充值缴费----补发操作 
		config.supplementGas = 'gasTblcustomer/supplementGas.do' ;
		
		//欠费处理----查询欠费账户信息
		config.getDataListArrears = 'gasTblcustomer/dataListArrears.do' ;
		
		//欠费处理----短信详情
		config.getMsgDetail = 'gasTblcustomer/searchMessage.do' ;
		
		//用户账单----流水信息
		config.dataListBills = 'gasTblcustomer/dataListBills.do' ;
		
		//价格管理----获取价格数据
		config.getTblPrice = 'gasTblprice/dataList.do' ;
		
		//价格管理----获取推送结果
		config.getPricePushInfo = 'gasTblprice/getPricePushInfo.do' ;
		
		//操作记录----获取操作日志信息
		config.getDataListLogs = 'gasTblcustomer/dataListLogs.do' ;
		
		//*******************系统监测*************************
		//实时数据----表具实时数据
		config.searchScadaLastData = 'baseTbldevice/searchScadaLastData.do' ;
		
		//实时数据----集中器连接状态实时数据
		config.getConcentratorState = 'baseTbldevice/getConcentratorState.do' ;
		
		//休眠账户----获取休眠账户数据
		config.listDormantCustomer = 'gasTblcustomer/listDormantCustomer.do' ;
		
		//休眠账户---获取流水信息数据
		config.dataListTrans = 'gasTblcustomer/dataListTrans.do' ;
		
		//*******************数据查询************************
		//日冻结数据----获取日冻结数据
		config.queryFrozenDataDaily = 'gasFrozenData/queryFrozenDataDaily.do' ;
		
		//月冻结数据----获取月冻结数据
		config.queryFrozenDataMonthly = 'gasFrozenData/queryFrozenDataMonthly.do' ;
		
		//*******************数据报表*************************
		//营业厅购气明细表----获取购气清单数据
		config.getBussinessPart = 'reportDetail/getBussinessPart.do' ;
		
		//*******************报警查询*************************
		//事件报警----获取事件报警数据
		config.searchIncidentAlert = 'gasTblalert/searchAlert.do' ;
		
		//*******************后台管理*************************
		//系统参数----参数组名
		config.optionGroups ='sysTblsysoption/getOptionGroup.do' ;
		
		//系统参数----系统参数列表
		config.sysOptionsDataList = 'sysTblsysoption/dataList.do' ;
		
		//系统参数----修改系统参数
		config.sysOptionsDataModify = 'sysTblsysoption/save.do' ;
		
		//角色管理----角色信息列表
		config.sysTblroleDataList = 'sysTblrole/dataList.do' ;
		
		//角色管理----通过id获取角色信息
		config.sysTblroleGetId = 'sysTblrole/getId.do' ;
		
		//角色管理----修改角色信息
		config.sysTblroleDataModify = 'sysTblrole/save.do' ;
		
		//角色管理----删除角色信息
		config.sysTblroleDataDelete = 'sysTblrole/delete.do' ;
		
		//角色管理----获取所有角色信息
		config.sysTblroleGetAllRole = 'sysTblrole/getAllRole.do' ;
		
		//人员管理----获取人员列表信息
		config.sysTblUserDataList = 'sysTbluser/dataList.do' ;
		
		//人员管理----重置密码
		config.updateInitPassword = 'sysTbluser/updateInitPassword.do' ;
		
		//人员管理----区域数据		params : showEmptyNode=0&keyId=
		config.baseTbZoneGetZoneTree = 'baseTblzone/getZoneTree.do' ;
		
		//人员管理----营业厅			params : showEmptyNode=0&keyId=
		config.sysTbldepartDataList = 'sysTbldepart/getDepartTree.do' ;
		
		//人员管理----保存/修改
		config.sysTblRoleSave = 'sysTbluser/save.do' ;
		
		//人员管理----删除
		config.sysTblRoleDelete = 'sysTbluser/delete.do' ;
		
		//菜单管理----获取菜单列表信息
		config.sysTblMenuDataList = 'sysTblsysmenu/dataList.do' ;
		
		//菜单管理----添加/修改
		config.sysTblMenuSave = 'sysTblsysmenu/save.do' ;
		
		//菜单管理---删除
		config.sysTblMenuDelete = 'sysTblsysmenu/delete.do' ;
		
		//营业厅管理----获取营业厅数据
		config.sysTblDepartDataList = 'sysTbldepart/dataList.do' ;
		
		//营业厅管理----保存营业厅数据
		config.sysTblDepartSave = 'sysTbldepart/save.do' ;
		
		//营业厅管理----删除营业厅数据
		config.sysTblDepartDelete = 'sysTbldepart/delete.do' ;
		
		//公司信息----获取公司信息
		config.sysTblCompanyDataList = 'sysTblcompany/dataList.do' ;
		
		//公司信息----保存公司信息
		config.sysTblCompanySave = 'sysTblcompany/save.do' ;
		
		//公司信息----删除公司信息
		config.sysTblCompanyDelete = 'sysTblcompany/delete.do' ;
		
		//区域管理----获取区域管理数据
		config.baseTblZoneDataList = 'baseTblzone/dataList.do' ;
		
		//区域管理----保存区域信息
		config.baseTblZoneSave = 'baseTblzone/save.do' ;
		
		//区域管理----删除区域信息
		config.baseTblZoneDelete = 'baseTblzone/delete.do' ;
		
		//区域管理----获取区域名称列表        params : showEmptyNode=1(0)&keyId=
		config.baseTblZoneTree = 'baseTblzone/getZoneTreeByUser.do' ;
		
		//区域管理----获取区域代码信息列表		params : showEmptyNode=0&keyId= 
		config.getZoneCodeTree = 'baseTblzone/getZoneCodeTree.do' ;
		
		//表具管理----获取表具数据
		config.baseTblDeviceDataList = 'baseTbldevice/dataList.do' ;
		
		//表具管理----保存表具数据
		config.baseTblDeviceSave= 'baseTbldevice/save.do' ;
		
		//表具管理----删除表具信息
		config.baseTblDeviceDelete = 'baseTbldevice/delete.do' ;
		
		//表具管理----设备种类树		params : showEmptyNode=0&keyId=
		config.baseTblDeviceTypeTree = 'baseTbldevice/getDeviceTypeTree.do' ;
		
		//表具管理----设备型号树		params : showEmptyNode=1&keyId=&typeid=01 02 03
		config.baseTblDeviceModelTree = 'baseTbldevice/getDeviceModelTree.do' ;
		
		//表具管理----获取集中器		params : showEmptyNode=1&keyId=&zoneid=
		config.getConcentratorByZone = 'baseTblconcentrator/getConcentratorByZone.do' ;
		
		//表具批量设置----获取表具批量设置信息
		//config.baseTblDeviceDataList = 'baseTbldevice/dataList.do' ;
		
		//设备型号管理----获取设备型号信息
		config.baseTblDeviceTypeDataList = 'sysTbldevicetype/dataList.do' ;
		
		//设备型号管理----保存设备型号信息
		config.baseTblDeviceTypeSave= 'sysTbldevicetype/save.do' ;
		
		//设备型号管理----删除设备型号信息
		config.baseTblDeviceTypeDelete = 'sysTbldevicetype/delete.do' ;
		
		//设备型号管理----IC卡类型   		params : showEmptyNode=1&keyId=
		config.baseTblDeviceCardType = 'baseTbldevice/getCardTypeTree.do' ;
		
		//GIS定位----			
		
		//新闻编辑----获取新闻信息
		config.issueTblnewsDataList = 'issueTblnews/dataList.do' ;
		
		//日志管理----获取日志信息
		config.sysTbllogDataList = 'sysTbllog/dataList.do' ;
		
		//*******************日常运维*************************
		//工单管理----获取工单数据
		config.workTblsheetData = 'workTblsheet/dataList.do' ;
		//*****************************************************
		
		//*******************定义全局对象********************
		config.type = 'dev';
		namespace.config = configMap[config.type];
		namespace.ChintPlugins = {};
		//*****************************************************

})(window);