package com.bancai;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.junit.Test;

import java.util.*;

public class test02 {
    private QueryAllService queryService;
    private InsertProjectService insertProjectService;
    @Test
    public void test() {
        String isPureWord = "^[A-Za-z]+$";
        String isNumber = "^[-\\\\+]?([0-9]+\\\\.?)?[0-9]+$";
        String isPureNumber = "[0-9]+";
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
//
//        Map<String,ArrayList<String>> map = new HashMap<>();
//        ArrayList<String> a = new ArrayList<>();
//        a.add("1000");
//        a.add("1001");
//        a.add("1002");
//        map.put("100U",a);
//        ArrayList<String> b = new ArrayList<>();
//        b.add("2000");
//        map.put("200U",b);
//        System.out.println(map);
//        System.out.println(a.get(0));
//        a.remove(a.size()-1);
//        a.remove(a.size()-1);
//        a.remove(a.size()-1);
//        System.out.println(a.size()==0);
//        ArrayList<String> c = new ArrayList<>();
//        c.add("3000");
//        c.add("3001");
//        map.put("300U",c);
//        ArrayList<String> d = new ArrayList<>();
//        d.add("4000");
//        d.add("4001");
//        map.put("400U",d);
//
//        Iterator iterator = map.keySet().iterator();
//        while (iterator.hasNext()) {
//            String key = iterator.next().toString();
//            System.out.println("map="+map);
//            System.out.println("key==="+key);
//            ArrayList<String> value = map.get(key);
//            if(key.equals("300U")){
//                c.remove(c.size()-1);
//                c.remove(c.size()-1);
//            }
//            if (value.size()==0){
//                iterator.remove();
//                System.out.println(map);
//            }
//        }
//        String key ="15N100 W 200";
//        String productId = key.split("N")[0];
//        String productName = key.substring(productId.length()+1);
//        System.out.println(productId);
//        System.out.println(productName);
//        DataList l = new DataList();
//        DataRow r = new DataRow();
//        DataRow r2 = new DataRow();
//        DataRow r3 = new DataRow();
//        r.put("id",1);
//        r.put("num",5);
//        r2.put("id",2);
//        r2.put("num",7);
//        r3.put("id",3);
//        r3.put("num",3);
//        l.add(r);
//        l.add(r2);
//        l.add(r3);
//        for (int i = 0; i < l.size(); i++) {
//            System.out.println("now==="+l.get(i).toString());
//            System.out.println(l.size());
//            if(l.get(i).get("id").toString().equals("2")){
//                System.out.println("remove=="+l.get(i).toString());
//                l.remove(i);
//                i--;
//            }
//        }
//        String tt = "100+200";
//        System.out.println(tt.split("\\+").length);
        //=========================================================
//        String s="2103";
//        for (int i = 0; i < 4; i++) {
//            switch (s.charAt(i)){
//                case '0':
//                    System.out.println("00");
//                    break;
//                case '1':
//                    System.out.println("11");
//                    break;
//                default:
//                    System.out.println("aa");
//                    break;
//            }
//        }
//        String ss = ">100%100%200";
//        System.out.println(ss.substring(2));
//        System.out.println(ss.split("%")[0].split("-").length);

//        DataList list = queryService.query("select * from oldpanel_info where id=15");
//        int a = 0;
//        if(list.get(0).get("pValue")!=null)
//            a = Integer.parseInt(list.get(0).get("pValue").toString());
//        System.out.println(a);
//        ArrayList<String> arrayList = new ArrayList<>();
//        HashMap<String,String> map = new HashMap<>();
//        map.put("productName","100 W 200");
//        map.put("positon","2123");
//        map.put("code","100");
//        arrayList.add(map.toString());
//        map.put("productName","100 W 210");
//        map.put("positon","2213");
//        map.put("code","100");
//        arrayList.add(map.toString());
//        System.out.println(arrayList.toString());

//        StringBuilder sb = new StringBuilder("dfdsfads,");
//        sb.deleteCharAt(sb.length()-1);
//        System.out.println(sb.toString());

//        HashMap<String,String> map = new HashMap<>();
//        map.put("kk1","vv1");
//        map.put("kk2","vv2");
//        map.put("kk1","vv3");
//        Iterator it = map.keySet().iterator();
//        while (it.hasNext()){
//            String key = it.next().toString();
//            String value = map.get(key);
//            System.out.println("(1)"+key);
//            System.out.println(value);
//        }
//        String t = "^[0-9]+\\.{0,1}[0-9]{0,2}$";
//        String s ="-5";
//        System.out.println(s.matches(t));
        String s = "200%150%null%null%null%0%0%0%%";
        System.out.println(s.split("%").length);


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
