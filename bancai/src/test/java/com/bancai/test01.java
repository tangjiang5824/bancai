package com.bancai;

import org.junit.Test;

public class test01 {

    @Test
    public void replaceSpace() {
        String s = "hello world ni";
        String newX = s.replace(" ","%20");
        System.out.println(newX);
//        return newX;
    }
}
