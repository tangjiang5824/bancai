package com.bancai.cg.util;

import org.apache.log4j.Logger;

import java.util.*;

public class newPanelMatch {

    public static Map<String,Integer> newpanel(String name){
        Logger log = Logger.getLogger(newPanelMatch.class);
        name=name.trim();//去掉前后空白
        String[] s = name.split(" ");
        double n=0;
        double a=0;
        double b=0;
        double m=0; //避免重复
        double a1=0;
        double b1=0;
        try{
            n= Double.parseDouble(s[0]);

        }catch (NumberFormatException e){
            String [] s2 =s[0].split("\\*");
           try{
               a= Double.parseDouble(s2[0]);
               b= Double.parseDouble(s2[1]);
               a1=a-13;
               b1=b-13;

           }catch (NumberFormatException e1){
               String []s3=s[0].split("\\+");
               a= Double.parseDouble(s3[0]);
               b=Double.parseDouble(s3[1]);
               a1=a-13;
               b1=b-13;

           }
        }
        try{
            m=Double.parseDouble(s[2]);

        }catch (Exception e){

        }

        String type=s[1].toUpperCase();
        Map<String,Integer> map=new HashMap<>();
        List<Double> List= Arrays.asList(50.0,100.0,110.0,120.0,130.0,150.0,200.0,250.0,300.0,350.0,400.0);
        //1首先匹配类型
        switch (type){
            //墙板
            case "W":
            case "WPE":
                if (n<400) {
                    map.put(doubleTrans(n)+" U "+doubleTrans(m),1);
                }else if(n==400.0){
                    map.put("400 U1 "+doubleTrans(m),1);
                }else {
                    log.error(type+"类型n超过400");
                }
                map.put("(A-17)60封边",2);
                if (n>=200){
                    if(((int)(m/300))-1>0)
                    map.put("(A-17)工字筋",(int)(m/300)-1);
                }else {
                    if("W".equals(type))
                    {
                        if(((int)(m/600))-1>0)
                        map.put("(A-17)工字筋",(int)(m/600)-1);}
                    else {
                        if(((int)(n/600))-1>0)
                        map.put("(A-17)工字筋",(int)(n/600)-1);
                    }
                }
                break;
            case "WP":
                if (s.length==3||s[3].equals("(-40)")||s[3].equals("（-40）")){
                    if (n<400) {
                        double H=m-40;
                        map.put(doubleTrans(n)+" U "+doubleTrans(H),1);
                    }else if(n==400.0){
                        double H=m-40;
                        map.put("400 U1 "+doubleTrans(H),1);
                    }else {
                        log.error("WP类型n超过400");
                    }
                    map.put("(A-17)60封边",2);
                    if (n>=200){
                        if(((int)(m/300))-1>0)
                        map.put("(A-17)工字筋",(int)(m/300)-1);
                    }else {
                        if(((int)(n/600))-1>0)
                        map.put("(A-17)工字筋",(int)(n/600)-1);}
                    map.put("(A长度)65X50角铝",1);
                    break;
                    }
            case "WA":
                if (n<400) {
                    double H=m-50;
                    map.put(doubleTrans(n)+" U "+doubleTrans(H),1);
                }else if(n==400.0){
                    double H=m-50;
                    map.put("400 U1 "+doubleTrans(H),1);
                }else {
                    log.error(type+"类型n超过400");
                }
                map.put("(A-17)60封边",2);
                if (n>=200){
                    if(((int)(m/300))-1>0)
                    map.put("(A-17)工字筋",(int)(m/300)-1);
                }else {
                    if(((int)(n/600))-1>0)
                    map.put("(A-17)工字筋",(int)(n/600)-1);}
                map.put("(A长度)65X40角铝",1);
                break;
                //其他平板
            case "B":
            case "BSB":
            case "SP":
            case "K":
                if(List.contains(n)){
                }else{
                    int index=0;
                    for (int i=0;i<List.size();i++) {
                        if(n>List.get(i)){
                            index=i;
                            break;
                        }
                    }
                    if(index==(List.size()-1))
                    {
                        log.error(type+"类型 n超过400");
                    }
                    n=List.get(index+1);
                }
                map.put(doubleTrans(n)+" U",1);
                if("K".equals(type)){
                    if(((int)(n/400))-1>0)
                    map.put("(A-17)60封边",(int)(n/400)+1);
                }else {
                    map.put("(A-17)60封边",2);

                    //判断辅材 K板没有辅材故在else里面
                    if (n>=200){
                        if(((int)(m/400))-1>0)
                        map.put("(A-17)工字筋",(int)(m/400)-1);
                        }else {
                        if(((int)(m/600))-1>0)
                        map.put("(A-17)工字筋",(int)(m/600)-1);
                    }
                }
                break;
                //飞机板
            case "WS":
            case "WSA":
            case "BS":
                if(n!=200.0){
                    log.error(type+"类型n不为200");
                }
                if("WSA".equals(type)){
                    int m1=(int)m-50;
                    map.put("200 BS "+doubleTrans(m1),1);
                    map.put("200长 65x50角铝",1);
                }else {
                    map.put("200 BS "+doubleTrans(m),1);
                }
                map.put("(A-17)60封边",1);
                if(n>=200){
                    if(((int)(m/400))-1>0)
                    map.put("(A-17)工字筋",(int)(m/400)-1);
                }else {
                    if(((int)(m/600))-1>0)
                    map.put("(A-17)工字筋",(int)(m/600)-1);
                }
                break;
                //支撑
            case "BP":
            case "BPP":
            case "BPPP":
                map.put(doubleTrans(n)+" U "+m,1);
                int l=type.length()-1;
                map.put("90长PLCS型材",l);
                map.put("60x60 4mm铝板",1);
                break;
                //直转角
            case "IC":
            case "ICA":
                map.put(a+"*"+b+" IC "+doubleTrans(m),1);
                if(((int)(n/800))-1>0)
                map.put(a1+"*"+b1+" 4mm铝板",(int)(n/800)+1);
                break;
            case "LS(SN)":
            case "LS（SN）":
                break;
            //case :
        }

        return map;
    }


    public static String doubleTrans(double num) {
        if (num % 1.0 == 0) {
            return String.valueOf((long) num);
        }
        return String.valueOf(num);
    }


}
