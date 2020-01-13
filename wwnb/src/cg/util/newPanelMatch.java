package cg.util;

import java.util.HashMap;
import java.util.Map;

public class newPanelMatch {

    public Map<String,String> newpanel(String name){
        String[] s = name.split(" ");
        String left=s[0];
        String right=s[2];
        String type=s[1].toUpperCase();
        //1首先匹配类型
        switch (type){
            case "W":
            case "" :
                break;
            //case :
        }

        return new HashMap<>();
    }
}
