package com.bancai;

import org.junit.Test;

import java.util.Scanner;

public class test02 {
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
        int conM = 0;
        String m = "0";
        String n = "0";
        String oldpanelName = "100 200";
        StringBuilder formatBuilder = new StringBuilder();
        String[] sOName = oldpanelName.split("\\s+");
        for (int i = 0; i < 4; i++) {
            try {
                if(conM==0){
                    m = sOName[i];
                    formatBuilder.append("2");
                    conM=1;
                } else if(conM==1){
                    n = sOName[i];
                    formatBuilder.append("3");
                    conM=2;
                }
            } catch (Exception e){
                formatBuilder.append("0");
            }
        }
        String format = formatBuilder.toString();
        if((format.contains("3"))&&(n.equals(SetLengthAndWidth(m,n)[0]))){
            String temp = m + n;
            n = temp.substring(0, temp.length()-n.length());
            m = temp.substring(n.length());
            format = format.replace("3","l");
            format = format.replace("2","3");
            format = format.replace("l","2");
        }
        System.out.println(format);
        System.out.println(m);
        System.out.println(n);

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
