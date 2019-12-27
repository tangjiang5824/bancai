package util.risk;

import java.io.PrintWriter;
import java.io.StringWriter;

import net.sf.json.JSONArray;

public class RiskBuilder {
	// public String getInsertSql(String now)
	// {
	// StringWriter sw = new StringWriter();
	// PrintWriter pw = new PrintWriter(sw);
	// pw.printf("insert into [%s](", resultTable());
	// for (String c : taColumns()) {
	// pw.printf("[%s_A],", c);
	// }
	// pw.printf("id_A,startTime,endTime,");
	// for (String c : tbColumns()) {
	// pw.printf("[%s_B],", c);
	// }
	// pw.printf("id_B,[状态],[校验时间],[说明]) %s",getSelectSql(now));
	// return sw.toString();
	// }
	private String getSelectSql() {
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		String va = getView(ta);
		String vb = getView(tb);
		pw.print("select ");
		for (String c : taColumns) {
			pw.printf("ta.[%s] as [%s_A],", c, c);
		}
		pw.printf("ta.id as [id_A],ta.startTime as startTime,ta.endTime as endTime,");
		for (String c : tbColumns) {
			pw.printf("tb.[%s] as [%s_B],", c, c);
		}
		pw.printf("tb.id as [id_B], '%s' as [note] ", note);
		pw.printf("from (%s) as ta left join (%s) as tb on ", va, vb);
		for (int i = 0; i < joins.length; i += 3) {

			if (i < joins.length - 5)
				pw.printf("ta.[%s] %s tb.[%s] and ", joins[i], joins[i + 1], joins[i + 2]);
			else
				pw.printf("ta.[%s] %s tb.[%s] ", joins[i], joins[i + 1], joins[i + 2]);
		}
		pw.printf("where %s and ta.id not in (select id_a from checkResult) ", cond);
		return sw.toString();

	}

	private String getViewA() {
		return getView(ta);
	}

	private String getViewB() {
		return getView(tb);
	}

	private String getView(String tbName) {
		return String.format("select t.*,u.startTime,u.endTime from [%s] as t left join uploadRecords as u on t.uploadId=u.id", tbName);
	}

	private String[] fields;
	private GridColumn[] columns;
	private String ta;
	private String[] taColumns;
	private String tb;
	private String[] tbColumns;
	private String[] joins;
	private RiskCondition cond;
	private String note;
	private String standardName;
	private Integer order;
	private String organizationId;
	public RiskBuilder(String standardName, String ta, String[] taColumns, String tb, String[] tbColumns, String[] joins, RiskCondition cond, String note,
			Integer order, String[] fields, GridColumn[] columns,String organizationId) {
		super();
		this.standardName = standardName;
		this.ta = ta;
		this.taColumns = taColumns;
		this.tb = tb;
		this.tbColumns = tbColumns;
		this.joins = joins;
		this.cond = cond;
		this.note = note;
		this.order = order;
		this.fields = fields;
		this.columns = columns;
		this.organizationId=organizationId;
	}
	
	public String build()
	{
//		System.out.println(standardName);
//		System.out.println(ta);
//		System.out.println(tb);
//		System.out.println(getViewA());
//		System.out.println(getViewB());
		System.out.println(getSelectSql());
//		System.out.println(JSONArray.fromObject(fields));
//		System.out.println(JSONArray.fromObject(columns));
//		System.out.println(order);
//		System.out.println(note);
		return String.format("insert into risk(standard,ta,tb,viewA,viewB,selectSql,fields,columns,[order],note,organizationId) values('%s','%s','%s','%s','%s','%s','%s','%s',%d,'%s','%s')", standardName,ta,tb,getViewA(),getViewB(),getSelectSql().replaceAll("'", "''"),JSONArray.fromObject(fields),JSONArray.fromObject(columns),order,note,organizationId);
	}
	public static void main(String args[])
	{
		String standardName="未申报医卫机构信息";
		String ta="区卫计委涉税信息表一（医卫机构信息）";
		String[] taColumns=new String[] { "社会信用代码", "机构名称", "机构地址" };
		String tb="税务登记信息查询";
		String[] tbColumns=new String[] { "纳税人识别号", "纳税人名称", "生产经营地址"};
		String[] joins=new String[] { "机构名称", "=", "纳税人名称", "社会信用代码", "=", "纳税人识别号" };
		RiskCondition cond=new RiskCondition("ta", "经营地址", "=", "tb", "生产经营地址").or("tb", "纳税人识别号", false);
		String note="未申报";
		Integer order=1;
		String[] fields=new String[] { "startTime","endTime","checkTime", "id_A", "社会信用代码_A", "机构名称_A", "id_B", "纳税人识别号_B", "纳税人名称_B",
					"生产经营地址_B", "id", "operateTime", "operator", "state", "note" };
		GridColumn[] columns=new GridColumn[] { 
					new GridColumn("所属期始", "startTime", 100),
					new GridColumn("所属期止", "endTime", 100),
					new GridColumn("社会信用代码[三方]", "社会信用代码（受让方）_A", 200), 
					new GridColumn("机构名称[三方]", "机构名称_A", 200),
					new GridColumn("机构地址[三方]", "机构地址_A", 200), 
					
					new GridColumn("纳税人识别号[金三]", "纳税人识别号_B", 200), 
					new GridColumn("纳税人名称[金三]", "纳税人名称_B", 200),
					new GridColumn("生产经营地址[金三]", "生产经营地址_B", 200), 
					
					new GridColumn("校验时间", "checkTime", 200), 
					new GridColumn("处理时间", "operateTime", 200),
					new GridColumn("处理人", "operator", 200), 
					new GridColumn("状态", "state", 200), 
					new GridColumn("说明", "note", 200) 
					};
		String organizationId="wzgs";
		RiskBuilder builder=new RiskBuilder( standardName,  ta,  taColumns,  tb,  tbColumns,  joins,  cond,  note,
				 order,  fields,  columns, organizationId);
		System.out.println(builder.build());;
	}
		
}
