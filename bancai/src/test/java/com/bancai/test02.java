package com.bancai;

import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import com.sun.javaws.IconUtil;
import org.junit.Test;

import java.util.*;

public class test02 {
    private QueryAllService queryService;
    @Test
    public void test() {
//        String s = "1 2 3 4";
//        String[] splited = s.split("\\s+");
//        int compare=0;
//        try {
//            String t = splited[3];
//            System.out.println(t);
//            try {
//                String r = splited[4];
//            } catch (Exception e){
//                System.out.println("r");
//            }
//        } catch (Exception e){
//            System.out.println("w");
//        }
//        String a = "100*150 U 100+300-200YQY";
//        System.out.println(IgnoreSuffix(a));
//        String[] b = a.split("\\*");
//        System.out.println(b[1]);
//        System.out.println(a.split("\\+")[0]);
//        System.out.println("====================");
//        System.out.println(SetLengthAndWidth("100","100")[0]);
//        String aa = "10";
//        String bb = "20";
//        compare = aa.compareTo(bb);
//        System.out.println(compare);
        String isPureNumber = "^-?[0-9]+";
        String isPureWord = "^[A-Za-z]+$";
//        String s = "2100";
//        String s2 = "%20%%AA";
//        String[] sp = s.split("");
//        String[] sp2 = s2.split("%");
//        System.out.println(sp.length);
//        for (int i = 0; i < sp.length; i++) {
//            if(sp[i].equals("1")){
//                System.out.println(sp2[i]);
//            }
//
//        }
//        String productName = "100X200 SN 150A+250B LA";
//        String[] a = productName.split("-")[0].split("\\s+");
//        String igS;
//        try{
//            igS = productName.split("-")[1];
//        } catch (ArrayIndexOutOfBoundsException e){
//            igS = "";
//        }
//        System.out.println(igS);
//        System.out.println(igS.equals(""));
//        for (String s : a) {
//            System.out.println(s);
//        }

//        String sql = "select * from matchrules where productTypeId=? and productNameFormat=?";
//        DataList list = queryService.query(sql, "1", "201");
//        Collections.sort(list);
// ====================================================
//        DataList dataList= new DataList();
//        DataRow dataRow = new DataRow();
//        Object newV = dataRow.get("num");
//        for(DataRow d : dataList){
//            Iterator<String> it = d.keySet().iterator();
//            while (it.hasNext()){
//                String key = it.next();
//                if(dataRow.containsKey(key)){
//                    dataRow
//                }
//            }
//        }
//        for (int i = 0; i < dataList.size(); i++) {
//            System.out.println(dataList.get(i).toString());
//        }
//===========================================================
//        Map<String,ArrayList<String>> map = new HashMap<>();
//        ArrayList<String> a = new ArrayList<>();
//        a.add("1000");
//        map.put("100U",a);
//        ArrayList<String> b = new ArrayList<>();
//        b.add("1001");
//        map.put("200U",b);
//        String name = "100U";
//        String pos = "1002";
//        if(map.containsKey(name)){
//            ArrayList<String> c = new ArrayList<>();
//            c=map.get(name);
//            c.add(pos);
//            map.put(name,c);
//        }
//        ArrayList<String> d = new ArrayList<>();
//        d.add("1003");
//        map.put("300U",d);
//        System.out.println(map.toString());
//        Iterator iterator=map.keySet().iterator();
//        while (iterator.hasNext()) {
//            String k = iterator.next().toString();
//            String v = map.get(k).toString();
//            System.out.println("k="+k+"==and==v="+v);
//        }
//        System.out.println(map.get("100U").size());
//        System.out.println(map.get("100U").get(0));
//        String productName = "100 BN 3001";
//        String idd = "15";
//        productName = idd + "N" + productName;
//        String id = productName.split("N")[0];
//        System.out.println(id);
//        productName = productName.substring(id.length()+1,productName.length()-1);
//        System.out.println(productName);
        //=====================================


    }

    private String IgnoreSuffix(String a){
        return a.split("-")[0];
    }
    private String[] SetLengthAndWidth(String m, String n){
        int a = Integer.parseInt(m);
        int b = Integer.parseInt(n);
        int max = Math.max(a,b);
        int min = Math.min(a,b);
        return new String[]{String.valueOf(max),String.valueOf(min)};
    }
}
