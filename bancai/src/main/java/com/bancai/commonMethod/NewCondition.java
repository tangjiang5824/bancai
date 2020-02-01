package com.bancai.commonMethod;
import java.util.ArrayList;
import java.util.List;

public class NewCondition {
    private StringBuffer buffer=new StringBuffer();
    private List<Object> parameters=new ArrayList<Object>();
    public NewCondition() {

    }
    public NewCondition(String property, String op, Object value) {
        super();
        buffer.append(property).append(op).append(" ?");
        parameters.add(value);
    }
    //区间查询
    public NewCondition(String property, String op, Object value1, Object value2) {
        super();
        buffer.append(property).append(op).append(" ? and ?");
        parameters.add(value1);
        parameters.add(value2);
    }
    public NewCondition(String property, String op, Object value, boolean text) {
        if(text) {
            buffer.append(property).append(op).append(" ?");
            parameters.add(value);
        }else {
            buffer.append("convert(float,"+property+") ").append(op).append(" ?");
            parameters.add(Float.parseFloat((String) value));
        }
    }
    public void and(NewCondition c)
    {
        if(buffer.length()!=0&&c.buffer.length()!=0)
        {
            buffer.insert(0, "(");
            buffer.append(")");
            buffer.append(" and (").append(c).append(")");
        }else if(c.buffer.length()!=0)
        {
            buffer.append(c);
        }
        for(Object o:c.parameters)
        {
            parameters.add(o);
        }
    }
    public void or(NewCondition c)
    {
        if(buffer.length()!=0&&c.buffer.length()!=0)
        {
            buffer.insert(0, "(");
            buffer.append(")");
            buffer.append(" or (").append(c).append(")");
        }else if(c.buffer.length()!=0)
        {
            buffer.append(c);
        }
        for(Object o:c.parameters)
        {
            parameters.add(o);
        }
    }
    public String toString()
    {
        return buffer.toString();
    }
    public Object[] getParameters()
    {
        return parameters.toArray(new Object[parameters.size()]);
    }
    public static void main(String args[])
    {
        String text="144.1802653245342";
        System.out.println(Double.parseDouble(text));
        System.out.println(Float.parseFloat(text));
    }

}