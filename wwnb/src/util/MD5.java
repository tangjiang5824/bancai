package util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

import org.apache.commons.codec.binary.Hex;

public class MD5 {

	public  static String encode(String string) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(string.getBytes());
            byte hash[] = md.digest();
            StringBuffer sb = new StringBuffer();
            int i = 0;
            for (int offset = 0; offset < hash.length; offset++) {
                i = hash[offset];
                if (i < 0) {
                    i += 256;
                }
                if (i < 16) {
                    sb.append("0");
                }
                sb.append(Integer.toHexString(i));
            }

            return sb.toString();
        }
        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
	public static String MD5WithSalt(String pwd) {
		 Random r = new Random();  
         StringBuilder sb = new StringBuilder(16);  
         sb.append(r.nextInt(99999999)).append(r.nextInt(99999999));  
         int len = sb.length();  
         if (len < 16) {  
             for (int i = 0; i < 16 - len; i++) {  
                 sb.append("0");  
             }  
         }  
         String salt = sb.toString();  
         pwd = md5Hex(pwd + salt);  
         char[] cs = new char[48];  
         for (int i = 0; i < 48; i += 3) {  
             cs[i] = pwd.charAt(i / 3 * 2);  
             char c = salt.charAt(i / 3);  
             cs[i + 1] = c;  
             cs[i + 2] = pwd.charAt(i / 3 * 2 + 1);  
         }  
         return new String(cs);  
	}
	private static String md5Hex(String src) {  
        try {  
            MessageDigest md5 = MessageDigest.getInstance("MD5");  
            byte[] bs = md5.digest(src.getBytes());  
            return new String(new Hex().encode(bs));  
        } catch (Exception e) {  
            return null;  
        }  
    }  
	/*public static void main(String[] args) {
			//System.out.println(encode("123456"));
			//4a0cbce4a2cd498396848f54cbcc8260
	}*/

}
