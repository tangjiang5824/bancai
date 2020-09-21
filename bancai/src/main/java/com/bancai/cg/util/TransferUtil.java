package com.bancai.cg.util;

import java.math.BigDecimal;

public class TransferUtil {
    public static double keep2tail(double bef){
        BigDecimal b = new BigDecimal(bef);
        return  b.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
    }
}
