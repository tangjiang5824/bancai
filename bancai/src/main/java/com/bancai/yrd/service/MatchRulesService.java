package com.bancai.yrd.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.domain.DataRow;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bancai.service.BaseService;
import com.bancai.util.Excel;
import com.bancai.vo.UploadDataResult;

@Service
public class MatchRulesService extends BaseService {
    private Logger log = Logger.getLogger(MatchRulesService.class);

    @Autowired
    private QueryAllService queryService;
    @Autowired
    private InsertProjectService insertProjectService;

    /*
     * 添加旧板匹配规则
     * */
    @Transactional
    public int addOldpanelMatchRules(String productFormatId,String oldpanelFormatId,String priority,String isCompleteMatch, String isValid
            , String pm1, String pm2, String pn1, String pn2, String pp1, String pp2, String pa1, String pa2, String pb1, String pb2, String pma, String pna, String ppa, String ps
            , String om1, String om2, String on1, String on2, String op1, String op2, String oa1, String oa2, String ob1, String ob2, String oma, String ona, String opa, String os
    ) {
        return insertProjectService.insertDataToTable("insert into zmatch_oldpanel_match_rules " +
                        "(productFormatId,oldpanelFormatId,priority,isCompleteMatch,isValid," +
                        ",pm1,pm2,pn1,pn2,pp1,pp2,pa1,pa2,pb1,pb2,pma,pna,ppa,ps" +
                        ",om1,om2,on1,on2,op1,op2,oa1,oa2,ob1,ob2,oma,ona,opa,os) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                ,productFormatId,oldpanelFormatId,priority,isCompleteMatch,isValid
                ,pm1,pm2,pn1,pn2,pp1,pp2,pa1,pa2,pb1,pb2,pma,pna,ppa,ps
                ,om1,om2,on1,on2,op1,op2,oa1,oa2,ob1,ob2,oma,ona,opa,os);
    }
    @Transactional
    public int addOldpanelMatchRules1(String productFormatId,String oldpanelFormatId,String priority,String isCompleteMatch
            ,String mValueP,String nValueP,String pValueP,String aValueP,String bValueP,String mAngleP,String nAngleP,String pAngleP,String suffixP
            ,String mValueO,String nValueO,String pValueO,String aValueO,String bValueO,String mAngleO,String nAngleO,String pAngleO,String suffixO) {
        return insertProjectService.insertDataToTable("insert into oldpanel_match_rules " +
                        "(productFormatId,oldpanelFormatId,priority,isCompleteMatch,isValid," +
                        "mConP,nConP,pConP,aConP,bConP,mAngleP,nAngleP,pAngleP,suffixP," +
                        "mConO,nConO,pConO,aConO,bConO,mAngleO,nAngleO,pAngleO,suffixO) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                ,productFormatId,oldpanelFormatId,priority,isCompleteMatch,"1"
                ,mValueP,nValueP,pValueP,aValueP,bValueP,mAngleP,nAngleP,pAngleP,suffixP
                ,mValueO,nValueO,pValueO,aValueO,bValueO,mAngleO,nAngleO,pAngleO,suffixO);
    }

    @Transactional
    public int addOldpanelMatchRules2(String productFormatId,String oldpanelFormatId,String priority,String isCompleteMatch
            ,String mValueP,String nValueP,String pValueP,String aValueP,String bValueP,String mAngleP,String nAngleP,String pAngleP,String suffixP
            ,String mValueO,String nValueO,String pValueO,String aValueO,String bValueO,String mAngleO,String nAngleO,String pAngleO,String suffixO) {
        String productFormat = queryService.query("select * from product_format where id=?",productFormatId).get(0).get("productFormat").toString();
        System.out.println(productFormat);
        String oldpanelFormat = queryService.query("select * from oldpanel_format where id=?",oldpanelFormatId).get(0).get("oldpanelFormat").toString();
        System.out.println(oldpanelFormat);
        String[] pCon = new String[]{"","","",""};
        String[] oRan = new String[]{"","","",""};
        for (int i = 0; i < productFormat.length(); i++) {
            switch (productFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    if((mValueP!=null)&&(!mValueP.equals("")))
                        pCon[i]=pCon[i]+mValueP;
                    break;
                case '3':
                    if((nValueP!=null)&&(!nValueP.equals("")))
                        pCon[i]=pCon[i]+nValueP;
                    break;
                case '4':
                case '9':
                    if((aValueP!=null)&&(!aValueP.equals("")))
                        pCon[i]=pCon[i]+aValueP;
                    pCon[i] = pCon[i]+"%";
                    if((bValueP!=null)&&(!bValueP.equals("")))
                        pCon[i]=pCon[i]+bValueP;
                    break;
                case '5':
                    if((bValueP!=null)&&(!bValueP.equals("")))
                        pCon[i]=pCon[i]+bValueP;
                    pCon[i] = pCon[i]+"%";
                    if((aValueP!=null)&&(!aValueP.equals("")))
                        pCon[i]=pCon[i]+aValueP;
                case '6':
                    if((mValueP!=null)&&(!mValueP.equals("")))
                        pCon[i]=pCon[i]+mValueP;
                    if((mAngleP!=null)&&(!mAngleP.equals("")))
                        pCon[i]=pCon[i]+"#"+mAngleP;
                    pCon[i] = pCon[i]+"%";
                    if((nValueP!=null)&&(!nValueP.equals("")))
                        pCon[i]=pCon[i]+nValueP;
                    if((nAngleP!=null)&&(!nAngleP.equals("")))
                        pCon[i]=pCon[i]+"#"+nAngleP;
                    break;
                case '8':
                    if((mValueP!=null)&&(!mValueP.equals("")))
                        pCon[i]=pCon[i]+mValueP;
                    if((mAngleP!=null)&&(!mAngleP.equals("")))
                        pCon[i]=pCon[i]+"#"+mAngleP;
                    pCon[i] = pCon[i]+"%";
                    if((nValueP!=null)&&(!nValueP.equals("")))
                        pCon[i]=pCon[i]+nValueP;
                    if((nAngleP!=null)&&(!nAngleP.equals("")))
                        pCon[i]=pCon[i]+"#"+nAngleP;
                    pCon[i] = pCon[i]+"%";
                    if((pValueP!=null)&&(!pValueP.equals("")))
                        pCon[i]=pCon[i]+pValueP;
                    if((pAngleP!=null)&&(!pAngleP.equals("")))
                        pCon[i]=pCon[i]+"#"+pAngleP;
                    break;
                case '7':
                    if((suffixP!=null)&&(!suffixP.equals("")))
                        pCon[i]=pCon[i]+suffixP;
                    break;
                default:
                    break;
            }
        }
        for (int i = 0; i < oldpanelFormat.length(); i++) {
            switch (oldpanelFormat.charAt(i)){
                case '0':
                case '1':
                    break;
                case '2':
                    if((mValueO!=null)&&(!mValueO.equals("")))
                        oRan[i]=oRan[i]+mValueO;
                    break;
                case '3':
                    if((nValueO!=null)&&(!nValueO.equals("")))
                        oRan[i]=oRan[i]+nValueO;
                    break;
                case '4':
                case '9':
                    if((aValueO!=null)&&(!aValueO.equals("")))
                        oRan[i]=oRan[i]+aValueO;
                    oRan[i] = oRan[i]+"%";
                    if((bValueO!=null)&&(!bValueO.equals("")))
                        oRan[i]=oRan[i]+bValueO;
                    break;
                case '5':
                    if((bValueO!=null)&&(!bValueO.equals("")))
                        oRan[i]=oRan[i]+bValueO;
                    oRan[i] = oRan[i]+"%";
                    if((aValueO!=null)&&(!aValueO.equals("")))
                        oRan[i]=oRan[i]+aValueO;
                case '6':
                    if((mValueO!=null)&&(!mValueO.equals("")))
                        oRan[i]=oRan[i]+mValueO;
                    if((mAngleO!=null)&&(!mAngleO.equals("")))
                        oRan[i]=oRan[i]+"#"+mAngleO;
                    oRan[i] = oRan[i]+"%";
                    if((nValueO!=null)&&(!nValueO.equals("")))
                        oRan[i]=oRan[i]+nValueO;
                    if((nAngleO!=null)&&(!nAngleO.equals("")))
                        oRan[i]=oRan[i]+"#"+nAngleO;
                    break;
                case '8':
                    if((mValueO!=null)&&(!mValueO.equals("")))
                        oRan[i]=oRan[i]+mValueO;
                    if((mAngleO!=null)&&(!mAngleO.equals("")))
                        oRan[i]=oRan[i]+"#"+mAngleO;
                    oRan[i] = oRan[i]+"%";
                    if((nValueO!=null)&&(!nValueO.equals("")))
                        oRan[i]=oRan[i]+nValueO;
                    if((nAngleO!=null)&&(!nAngleO.equals("")))
                        oRan[i]=oRan[i]+"#"+nAngleO;
                    oRan[i] = oRan[i]+"%";
                    if((pValueO!=null)&&(!pValueO.equals("")))
                        oRan[i]=oRan[i]+pValueO;
                    if((pAngleO!=null)&&(!pAngleO.equals("")))
                        oRan[i]=oRan[i]+"#"+pAngleO;
                    break;
                case '7':
                    if((suffixO!=null)&&(!suffixO.equals("")))
                        oRan[i]=oRan[i]+suffixO;
                    break;
                default:
                    break;
            }
        }
        return insertProjectService.insertDataToTable("insert into oldpanel_match_rules (productFormatId,oldpanelFormatId," +
                "pCon1,pCon2,pCon3,pCon4,oRan1,oRan2,oRan3,oRan4,priority,isCompleteMatch,isValid) values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
                ,productFormatId,oldpanelFormatId,pCon[0],pCon[1],pCon[2],pCon[3],oRan[0],oRan[1],oRan[2],oRan[3],priority,isCompleteMatch,"1");
    }








}

