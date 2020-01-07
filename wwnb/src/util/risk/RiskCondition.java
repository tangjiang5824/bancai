package util.risk;

import java.io.PrintWriter;
import java.io.StringWriter;

public class RiskCondition {
	
	private StringBuffer buffer=new StringBuffer();

	public RiskCondition(String tbName,String pName, Boolean nullable) {
		if(nullable)
			buffer.append(tbName).append(".[").append(pName).append("] ").append("is null");
		else
			buffer.append(tbName).append(".[").append(pName).append("] ").append("is not null");
	}
	public RiskCondition(String tbName1,String pName1, String op, String tbName2,String pName2) {
		buffer.append(tbName1).append(".[").append(pName1).append("] ").append(op);
		buffer.append(tbName2).append(".[").append(pName2).append("] ");
	}
	public RiskCondition(String tbName,String pName, String op, String value) {
		buffer.append(tbName).append(".[").append(pName).append("] ").append(op);
		buffer.append("'").append(value).append("'");
	}
	public RiskCondition(String tbName,String pName, String op, Float value) {
		buffer.append(tbName).append(".[").append(pName).append("] ").append(op);
		buffer.append(value);
	}
	public RiskCondition(String tbName,String pName, String op, Integer value) {
		buffer.append(tbName).append(".[").append(pName).append("] ").append(op);
		buffer.append(value);
	}
	public RiskCondition(String tbName,String pName, String op, Double value) {
		buffer.append(tbName).append(".[").append(pName).append("] ").append(op);
		buffer.append(value);
	}
	/**
	 * create by flx
	 * @param c
	 * @return
	 */
	public RiskCondition(String tbName1,String pName1, String op1, String tbName2,String pName2,String op2,String tbName3,String pName3) {
		buffer.append(tbName1).append(".[").append(pName1).append("] ").append(op1);
		buffer.append(tbName2).append(".[").append(pName2).append("] ").append(op2);
		buffer.append(tbName3).append(".[").append(pName3).append("]");
	}
	public RiskCondition and(RiskCondition c)
	{
		buffer.insert(0, "(");
		buffer.append(")");
		buffer.append(" and (").append(c).append(")");
		return this;
	}
	public RiskCondition and(String tbName,String pName, Boolean nullable)
	{
		return and(new RiskCondition(tbName,pName,nullable));
	}
	public RiskCondition and(String tbName1,String pName1, String op, String tbName2,String pName2)
	{
		return and(new RiskCondition(tbName1,pName1,op,tbName2,pName2));
	}
	public RiskCondition and(String tbName1,String pName1, String op,String value)
	{
		return and(new RiskCondition(tbName1,pName1,op,value));
	}
	public RiskCondition and(String tbName1,String pName1, String op,Float value)
	{
		return and(new RiskCondition(tbName1,pName1,op,value));
	}
	public RiskCondition and(String tbName1,String pName1, String op,Integer value)
	{
		return and(new RiskCondition(tbName1,pName1,op,value));
	}
	public RiskCondition or(RiskCondition c)
	{
		buffer.insert(0, "(");
		buffer.append(")");
		buffer.append(" or (").append(c).append(")");
		return this;
	}
	public RiskCondition or(String tbName,String pName, Boolean nullable)
	{
		return or(new RiskCondition(tbName,pName,nullable));
	}
	public RiskCondition or(String tbName1,String pName1, String op, String tbName2,String pName2)
	{
		return or(new RiskCondition(tbName1,pName1,op,tbName2,pName2));
	}
	public RiskCondition or(String tbName1,String pName1, String op,String value)
	{
		return or(new RiskCondition(tbName1,pName1,op,value));
	}
	public RiskCondition or(String tbName1,String pName1, String op,Float value)
	{
		return or(new RiskCondition(tbName1,pName1,op,value));
	}
	public RiskCondition or(String tbName1,String pName1, String op,Integer value)
	{
		return or(new RiskCondition(tbName1,pName1,op,value));
	}
	public String toString() {
		return buffer.toString();
	}
	public static void main(String args[])
	{
//		RiskCondition s=new RiskCondition("ta","name",true);
//		s.or(new RiskCondition("tb","name",false)).and(new RiskCondition("tb","n2ame",true));
//		RiskCondition s=new RiskCondition("ta", "c1", "=", "123");
//		System.out.println(s);
//		StringWriter sw=new StringWriter();
//		PrintWriter pw=new PrintWriter(sw);
//		pw.printf("1 is %d and 2 is %d", 1,2);
//		System.out.println(sw.toString());
		RiskCondition s=new RiskCondition("ta","a1", "-", "tb","b1",">","tc","c1");
		RiskCondition c=new RiskCondition("ta", "a2", ">", "10");
		s.or("tb", "b1",false).and(c);
		System.out.println(s);
	}
}
