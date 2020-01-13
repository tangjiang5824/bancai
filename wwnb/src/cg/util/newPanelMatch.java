package cg.util;

import java.util.HashMap;
import java.util.Map;

public class newPanelMatch {

    public Map<String,String> newpanel(String name){
        String[] s = name.split(" ");
        int n= Integer.parseInt(s[0]);
        int m=Integer.parseInt(s[2]);
        String type=s[1].toUpperCase();
        Map<String,Integer> map=new HashMap<>();
        //1首先匹配类型
        switch (type){
            case "W":
            case "WPE":
                if (n<400) {
                    map.put(n+" U "+m,1);
                }else if(n==400){
                    map.put("400 U1 "+m,1);
                }else {}
                map.put("(A-17)60封边",2);
                if (n>=200){
                    map.put("(A-17)工字筋",m/300-1);
                }else {
                    if(type.equals("W"))
                    {
                        map.put("(A-17)工字筋",m/600-1);}
                    else {
                        map.put("(A-17)工字筋",n/600-1);
                    }
                }
                break;
            case "WP":
                if (s.length==3||s[3].equals("(-40)")||s[3].equals("（-40）")){
                    if (n<400) {
                        int H=m-40;
                        map.put(n+" U "+H,1);
                    }else if(n==400){
                        int H=m-40;
                        map.put("400 U1 "+H,1);
                    }else {}
                    map.put("(A-17)60封边",2);
                    if (n>=200){
                        map.put("(A-17)工字筋",m/300-1);
                    }else {
                        map.put("(A-17)工字筋",n/600-1);}
                    map.put("(A长度)65X50角铝",1);
                    break;
                    }
            case "WA":
                if (n<400) {
                    int H=m-50;
                    map.put(n+" U "+H,1);
                }else if(n==400){
                    int H=m-50;
                    map.put("400 U1 "+H,1);
                }else {}
                map.put("(A-17)60封边",2);
                if (n>=200){
                    map.put("(A-17)工字筋",m/300-1);
                }else {
                    map.put("(A-17)工字筋",n/600-1);}
                map.put("(A长度)65X40角铝",1);
                break;
                

            //case :
        }

        return new HashMap<>();
    }
}
