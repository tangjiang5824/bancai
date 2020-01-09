<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--[if IE]><![endif]-->
<!--[if IE 8 ]>    <html lang="zh" class="ie8"> 
 <link rel="stylesheet" type="text/css" href="show.css"> 

  <![endif]-->
<!--[if IE 9 ]>    <html lang="zh" class="ie9">    <![endif]-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>企业信息</title>
<style type="text/css">
#enterpriseInfo {
	/* background-color: #F0F8FF; */
	width: 100%;
	height: auto;
	font-family: Georgia, serif;
}

h2 {
	font-size: 22px;
	margin-top: 20px;
	font-family: Georgia, serif;
	color: #363636;
	margin-bottom: 5px;
}

h2 img {
	width: 22px;
	padding-bottom: 0px;
}

table {
	width: 100%;
	border-spacing: 1px;
}

table td {
	height: 25px;
	border: 1px solid #eee;
	white-space: nowrap;
}

table tr {
	margin-bottom: 20px;
}

.td-column-name {
	width: 200px;
	background-color: #F0F8FF;
	font-size: 20px;
}

.text {
	width: 100%;
	height: 22px;
	font-size: 20px;
}
</style>
</head>
<body>
	<h2>
		<img alt="logo" class="logo" src="images/logo.png"> 纳税人基本信息
	</h2>
	<div id="enterpriseInfo">
		<table cellspacing="0px">
			<tr>
				<td align="center" class="td-column-name">纳税人名称</td>
				<td colspan="3"><span id="纳税人名称" class="text"></span></td>
				<td align="center" class="td-column-name" colspan="">
					社会信用代码(纳税人识别号)</td>
				<td colspan="3"><span id="社会信用代码(纳税人识别号)" class="text"></span>
				</td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">纳税人状态</td>
				<td colspan="3"><span id="纳税人状态" class="text"></span></td>
				<td align="center" class="td-column-name">登记日期</td>
				<td colspan="3"><span id="登记日期" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">主管税务局代码</td>
				<td colspan="3"><span id="主管税务局代码" class="text"></span></td>
				<td align="center" class="td-column-name">主管税务所（科、分局）</td>
				<td colspan="3"><span id="主管税务所（科、分局）" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">登记注册类型</td>
				<td colspan="3"><span id="登记注册类型" class="text"></span></td>
				<td align="center" class="td-column-name">组织机构代码</td>
				<td colspan="3"><span id="组织机构代码" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">批准设立机关名称</td>
				<td colspan="3"><span id="批准设立机关名称" class="text"></span></td>
				<td align="center" class="td-column-name">批准设立机关类型代码</td>
				<td colspan="1"><span id="批准设立机关类型代码" class="text"></span></td>
				<td align="center" class="td-column-name">批准证明或文件号</td>
				<td colspan="1"><span id="批准证明或文件号" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">临时税务登记注册类型</td>
				<td colspan="3"><span id="临时税务登记注册类型" class="text"></span></td>
				<td align="center" class="td-column-name">临时税务登记有效期起</td>
				<td colspan="1"><span id="临时税务登记有效期起" class="text"></span></td>
				<td align="center" class="td-column-name">临时税务登记有效期止</td>
				<td colspan="1"><span id="临时税务登记有效期止" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">开业设立日期</td>
				<td colspan="3"><span id="开业设立日期" class="text"></span></td>
				<td align="center" class="td-column-name">生产经营期限起</td>
				<td colspan="1"><span id="生产经营期限起" class="text"></span></td>
				<td align="center" class="td-column-name">生产经营期限止</td>
				<td colspan="1"><span id="生产经营期限止" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">执照类型名称</td>
				<td colspan="3"><span id="执照类型名称" class="text"></span></td>
				<td align="center" class="td-column-name">证照编号</td>
				<td colspan="1"><span id="证照编号" class="text"></span></td>
				<td align="center" class="td-column-name">办证方式</td>
				<td colspan="1"><span id="办证方式" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">总分机构类型</td>
				<td colspan="1"><span id="总分机构类型" class="text"></span></td>
				<td align="center" class="td-column-name">街道乡镇</td>
				<td colspan="1"><span id="街道乡镇" class="text"></span></td>
				<td align="center" class="td-column-name">隶属关系</td>
				<td colspan="1"><span id="隶属关系" class="text"></span></td>
				<td align="center" class="td-column-name">税收管理员</td>
				<td colspan="1"><span id="税收管理员" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">注册地址</td>
				<td colspan="3"><span id="注册地址" class="text"></span></td>
				<td align="center" class="td-column-name">注册地邮政编码</td>
				<td colspan="1"><span id="注册地邮政编码" class="text"></span></td>
				<td align="center" class="td-column-name">注册地联系电话</td>
				<td colspan="1"><span id="注册地联系电话" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">生产经营地址</td>
				<td colspan="3"><span id="生产经营地址" class="text"></span></td>
				<td align="center" class="td-column-name">生产经营地邮政编码</td>
				<td colspan="1"><span id="生产经营地邮政编码" class="text"></span></td>
				<td align="center" class="td-column-name">生产经营地联系电话</td>
				<td colspan="1"><span id="生产经营地联系电话" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">注册地址所在行政区划</td>
				<td colspan="1"><span id="注册地址所在行政区划" class="text"></span></td>
				<td align="center" class="td-column-name">经营地址所在行政区划</td>
				<td colspan="1"><span id="经营地址所在行政区划" class="text"></span></td>
				<td align="center" class="td-column-name">单位性质</td>
				<td colspan="1"><span id="单位性质" class="text"></span></td>
				<td align="center" class="td-column-name">网站网址</td>
				<td colspan="1"><span id="网站网址" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">从业人数</td>
				<td colspan="1"><span id="从业人数" class="text"></span></td>
				<td align="center" class="td-column-name">雇工人数</td>
				<td colspan="1"><span id="雇工人数" class="text"></span></td>
				<td align="center" class="td-column-name">合伙人数</td>
				<td colspan="1"><span id="合伙人数" class="text"></span></td>
				<td align="center" class="td-column-name">其中外籍人数</td>
				<td colspan="1"><span id="其中外籍人数" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">固定工人数</td>
				<td colspan="1"><span id="固定工人数" class="text"></span></td>
				<td align="center" class="td-column-name">核算方式</td>
				<td colspan="1"><span id="核算方式" class="text"></span></td>
				<td align="center" class="td-column-name">会计制度（准则）</td>
				<td colspan="1"><span id="会计制度（准则）" class="text"></span></td>
				<td align="center" class="td-column-name">国地管户类型</td>
				<td colspan="1"><span id="国地管户类型" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">行业门类</td>
				<td colspan="1"><span id="行业门类" class="text"></span></td>
				<td align="center" class="td-column-name">行业大类</td>
				<td colspan="1"><span id="行业大类" class="text"></span></td>
				<td align="center" class="td-column-name">行业中类</td>
				<td colspan="1"><span id="行业大类" class="text"></span></td>
				<td align="center" class="td-column-name">行业小类</td>
				<td colspan="1"><span id="行业小类" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">联系电话</td>
				<td><span id="联系电话" class="text"></span></td>
				<td align="center" class="td-column-name">经营范围</td>
				<td colspan="5"><span id="经营范围" class="text"></span></td>

			</tr>
			<tr>
				<td align="center" class="td-column-name">法定代表人（负责人、业主）姓名</td>
				<td colspan="1"><span id="法定代表人（负责人、业主）姓名" class="text"></span>
				</td>
				<td align="center" class="td-column-name">法定代表人（负责人、业主）身份证种类</td>
				<td colspan="1"><span id="法定代表人（负责人、业主）身份证种类" class="text"></span>
				</td>
				<td align="center" class="td-column-name">法定代表人（负责人、业主）身份证号码</td>
				<td colspan="1"><span id="法定代表人（负责人、业主）身份证号码" class="text"></span>
				</td>
				<td align="center" class="td-column-name">法定代表人（负责人、业主）电子邮箱</td>
				<td colspan="1"><span id="法定代表人（负责人、业主）电子邮箱" class="text"></span>
				</td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">办税人姓名</td>
				<td colspan="1"><span id="办税人姓名" class="text"></span></td>
				<td align="center" class="td-column-name">办税人身份证件种类</td>
				<td colspan="1"><span id="办税人身份证件种类" class="text"></span></td>
				<td align="center" class="td-column-name">办税人身份证件号码</td>
				<td colspan="1"><span id="办税人身份证件号码" class="text"></span></td>
				<td align="center" class="td-column-name">办税人电话号码</td>
				<td colspan="1"><span id="办税人电话号码" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">财务负责人姓名</td>
				<td colspan="3"><span id="财务负责人姓名" class="text"></span></td>
				<td align="center" class="td-column-name">财务负责人电话</td>
				<td colspan="3"><span id="财务负责人电话" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">注册资本</td>
				<td colspan="3"><span id="注册资本" class="text"></span></td>
				<td align="center" class="td-column-name">注册资本币种一</td>
				<td colspan="3"><span id="注册资本币种一" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">录入人</td>
				<td colspan="3"><span id="录入人" class="text"></span></td>
				<td align="center" class="td-column-name">录入日期</td>
				<td colspan="3"><span id="录入日期" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">是否购买发票</td>
				<td colspan="1"><span id="是否购买发票" class="text"></span></td>
				<td align="center" class="td-column-name">一般纳税人标志</td>
				<td colspan="1"><span id="一般纳税人标志" class="text"></span></td>
				<td align="center" class="td-column-name">登记序号</td>
				<td colspan="1"><span id="登记序号" class="text"></span></td>
				<td align="center" class="td-column-name">功能区域</td>
				<td colspan="1"><span id="功能区域" class="text"></span></td>
			</tr>
			<tr>
				<td align="center" class="td-column-name">会计制度（准则）</td>
				<td colspan="3"><span id="会计制度（准则）" class="text"></span></td>
				<td align="center" class="td-column-name">国有控股类型</td>
				<td colspan="3"><span id="国有控股类型" class="text"></span></td>
			</tr>
		</table>
	</div>
	<script src="extjs/jquery-1.12.0.min.js"></script>
	<script src="extjs/ext-all.js"></script>
	<script>
	/* var $id_A=$('#社会信用代码\\(纳税人识别号\\)')
	$id_A.html('<h1>asd</h1>')
	console.log('社会信用代码\\(纳税人识别号\\)') */
	// var local=localStorage.getItem('enterpriseInfo');
	//var data=Ext.decode(local);
	var checkSpecialChar=function(str){
		var re = /[~#^$@%&!*()<>:;{}]/gi;
		var s="";
		for(var i=0;i<str.length;i++){
			var c =str.charAt(i);
			if(re.test(c))
				s+="\\"+c;
			else
				s+=c
		}
	    return s; 
	}
	//var columns=data.columns;
	//var value=data.value[0];
	$(document).ready(function(){
		var s="社会信用代码(纳税人识别号)";
		var id=checkSpecialChar(s);
		$id_A=$('#'+id);
		$id_A.text('<h1>hello world</h1>')
		 /* for(var j=0;j<columns.length;j++){
			var info=checkSpecialChar(columns[j].text);
			var text=columns[j].dataIndex;
			$id=$('#'+info)
			console.log("#")
			$id.text(value[info])
		}	  */
	}) 
	</script>
</body>
</html>