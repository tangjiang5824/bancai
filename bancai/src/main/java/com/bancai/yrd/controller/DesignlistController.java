package com.bancai.yrd.controller;

import com.bancai.cg.service.InsertProjectService;
import com.bancai.commonMethod.PanelMatchService;
import com.bancai.commonMethod.QueryAllService;
import com.bancai.domain.DataList;
import com.bancai.yrd.service.DesignlistService;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.bancai.service.TableService;
import com.bancai.vo.UploadDataResult;
import com.bancai.vo.WebResponse;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class DesignlistController {
    @Autowired
    private TableService tableService;
    @Autowired
    private QueryAllService queryService;
    @Autowired
    private PanelMatchService panelMatchService;
    @Autowired
    private DesignlistService designlistService;
    @Autowired
    private InsertProjectService insertProjectService;

    private static String isPureNumber = "^-?[0-9]+";
    Logger log=Logger.getLogger(DesignlistController.class);

    /*
     * 上传excel文件designlist
     * */
    @RequestMapping(value = "/designlist/uploadExcel.do")
    public WebResponse oldpanelUploadMatchData(MultipartFile uploadFile, String projectId, String buildingId, String buildingpositionId, HttpSession session) {
        WebResponse response = new WebResponse();
        String userId = (String)session.getAttribute("userid");
        try {
            UploadDataResult result = designlistService.uploadDesignlist(uploadFile.getInputStream(), userId, projectId, buildingId, buildingpositionId);
            response.setSuccess(result.success);
            response.setErrorCode(result.errorCode);
            response.put("value",result.dataList);
            response.put("totalCount", result.dataList.size());

        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setErrorCode(1000); //未知错误
            response.setMsg(e.getMessage());
        }
        //net.sf.json.JSONObject json= net.sf.json.JSONObject.fromObject(response);
        return response;
    }
    /*
     * 添加或更新操作员信息
     * */
    @RequestMapping("/department/addOrUpdateWorkerInfo.do")
    public boolean addOrUpdateWorkerInfo(String id, String departmentId, String workerName,String tel){
        workerName = workerName.trim();
        tel = tel.trim();
        boolean exist = false;
        if(id.matches(isPureNumber)){
            DataList list = queryService.query("select * from department_worker where id=?",id);
            if(!list.isEmpty())
                exist = true;
        }
        System.out.println(id+"==="+departmentId+"==="+workerName+"==="+tel);
        designlistService.saveDepartmentWorkerData(id,departmentId,workerName,tel,exist);
        return true;
    }

    /*
     * 查询工单
     * */
    @RequestMapping("/order/queryWorkOrder.do")
    public void queryWorkOrder(String projectId, String buildingId, String buildingpositionId,
                               HttpServletResponse response) throws IOException, JSONException {
        DataList workOrderList = designlistService.findWorkOrder(projectId, buildingId, buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(workOrderList);
        object.put("workOrderList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }
    /*
     * 查询工单detail
     * */
    @RequestMapping("/order/queryWorkOrderDetail.do")
    public void queryWorkOrderDetail(String projectId, String buildingId, String buildingpositionId,
                               HttpServletResponse response) throws IOException, JSONException {
        DataList workOrderDetailList = designlistService.findWorkOrderDetail(projectId, buildingId, buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(workOrderDetailList);
        object.put("workOrderDetailList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();

    }

    /*
     * 新建领料单
     * */
    @RequestMapping(value = "/order/addRequisitionOrder.do")
    public boolean addRequisitionOrder(String s, String operator, HttpSession session) throws JSONException {
        try {
            JSONArray jsonArray = new JSONArray(s);
            String userId = (String)session.getAttribute("userid");
            Date date=new Date();
            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            int[] requisitionId = designlistService.orderAddRequisition(userId,operator,simpleDateFormat.format(date));
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个---" + jsonTemp);
                String workOrderDetailId=jsonTemp.get("workOrderDetailId")+"";
                designlistService.orderAddRequisitionDetail(requisitionId[0], requisitionId[1], workOrderDetailId);
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }
    /*
     * 查询领料单
     * */
    @RequestMapping("/order/queryRequisitionOrder.do")
    public void queryRequisitionOrder(HttpServletResponse response) throws IOException, JSONException {
        DataList requisitionOrderList = designlistService.findRequisitionOrder();
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(requisitionOrderList);
        object.put("requisitionOrderList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /*
     * 查询某张领料单细节
     * */
    @RequestMapping("/order/queryRequisitionOrderDetail.do")
    public void queryRequisitionOrderDetail(String requisitionOrderId,String projectId, String buildingId, String buildingpositionId,
                                      HttpServletResponse response) throws IOException, JSONException {
        DataList requisitionOrderDetailList = designlistService.findRequisitionOrderDetail(requisitionOrderId,projectId,buildingId,buildingpositionId);
        //写回前端
        JSONObject object = new JSONObject();
        JSONArray array = new JSONArray(requisitionOrderDetailList);
        object.put("requisitionOrderDetailList", array);
//        System.out.println("类型1：--"+array.getClass().getName().toString());
        response.setCharacterEncoding("UTF-8");
        response.setContentType("text/html");
        response.getWriter().write(object.toString());
        response.getWriter().flush();
        response.getWriter().close();
    }

    /*
     * 确认领料完成
     * */
    @RequestMapping(value = "/order/finishRequisitionOrder.do")
    public boolean finishRequisitionOrder(String s, String operator, HttpSession session) throws JSONException {
        try {
            JSONArray jsonArray = new JSONArray(s);
            if(jsonArray.length()==0)
                return false;
            String userId = (String)session.getAttribute("userid");
            Date date=new Date();
            SimpleDateFormat simpleDateFormat=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String requisitionOrderId = jsonArray.getJSONObject(0).get("requisitionOrderId")+"";
            String sql_addLog = "insert into requisition_order_log (type,requisitionOrderId,userId,time,operator) values(?,?,?,?,?)";
            int requisitionOrderLogId= insertProjectService.insertDataToTable(sql_addLog, "2"
                    , requisitionOrderId,userId,simpleDateFormat.format(date),operator);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonTemp = jsonArray.getJSONObject(i);
                System.out.println("第" + i + "个---" + jsonTemp);
                String requisitionOrderDetailId=jsonTemp.get("requisitionOrderDetailId")+"";
                String count = (jsonTemp.get("count")+"").trim();
                String countRec = jsonTemp.get("countRec")+"";
                int type = Integer.parseInt(jsonTemp.get("type")+"");
                String storeId = jsonTemp.get("storeId")+"";
                if((count.length()==0)||(Double.parseDouble(count)<0)||(Double.parseDouble(count)>Double.parseDouble(countRec)))
                    continue;
                boolean is_update_right = designlistService.orderUpdateRequisitionDetail(requisitionOrderDetailId,count,type,storeId);
                if(!is_update_right)
                    return false;
                String sql_addLogDetail="insert into requisition_order_logdetail (requisitionOrderLogId,requisitionOrderDetailId,count)" +
                        " values (?,?,?)";
                boolean is_log_right= insertProjectService.insertIntoTableBySQL(sql_addLogDetail,
                        String.valueOf(requisitionOrderLogId),requisitionOrderDetailId,count);
                if(!is_log_right){
                    return false;
                }
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }






}
