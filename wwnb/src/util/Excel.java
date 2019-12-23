package util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.web.multipart.MultipartFile;

import domain.DataList;
import domain.DataRow;
import sun.util.logging.resources.logging;

/**
 * 操作Excel表格的功能类
 */
public class Excel {
	private Logger log = Logger.getLogger(Excel.class);
	private HSSFWorkbook wb;

	public Excel(InputStream inputStream) throws IOException {
		wb = new HSSFWorkbook(inputStream);
	}

	public Excel(MultipartFile excel) throws IOException {
		this(excel.getInputStream());
	}

	public Excel(File file) throws IOException {
		this(new FileInputStream(file));
	}

	public Excel(String tableName, DataList columnList) {
		// 创建一个新的Excel
		wb = new HSSFWorkbook();
		// 创建sheet页
		HSSFSheet sheet = wb.createSheet();
		// sheet页名称
		wb.setSheetName(0, "sheet1");
		int columnSize = columnList.size();
		// 设置列宽
		for (int i = 0; i < columnSize; i++)
			sheet.setColumnWidth(i, 5000);
		// 创建标题行
		HSSFRow firstRow = sheet.createRow(0);
		HSSFCellStyle firstRowStyle=createCellStyle(true,CellStyle.ALIGN_CENTER, CellStyle.VERTICAL_CENTER, "黑体", (short) 20, null, false);
		for (int i = 0; i < columnSize; i++)
			firstRow.createCell(i).setCellStyle(firstRowStyle);;
		sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnSize - 1)); //合并
		firstRow.getCell(0).setCellValue(tableName);
		firstRow.setHeightInPoints(50);
		// 创建批次行
		HSSFRow secondRow = sheet.createRow(1);
		HSSFCellStyle secondRowStyle=createCellStyle(false,CellStyle.ALIGN_LEFT, CellStyle.VERTICAL_CENTER, "黑体", (short) 12, HSSFColor.YELLOW.index, true);
		for (int i = 0; i < columnSize; i++)
			secondRow.createCell(i).setCellStyle(secondRowStyle);;
		sheet.addMergedRegion(new CellRangeAddress(1, 1, 1, columnSize - 1));
		secondRow.getCell(0).setCellValue("批次：");
		secondRow.getCell(1).setCellValue("请在此处填写上传批次");
		// 设置批次行样式
		secondRow.setHeightInPoints(50);
		secondRow.getCell(0).setCellStyle(createCellStyle(true,CellStyle.ALIGN_CENTER, CellStyle.VERTICAL_CENTER, "黑体", (short) 10, null, true));
		// 创建列名行
		HSSFRow thirdRow = sheet.createRow(2);
		thirdRow.setHeightInPoints(50);
		HSSFCellStyle blankStyle = createCellStyle(true,CellStyle.ALIGN_CENTER, CellStyle.VERTICAL_CENTER, "宋体", (short) 10, null, true);
		HSSFCellStyle nonBlankStyle = createCellStyle(true,CellStyle.ALIGN_CENTER, CellStyle.VERTICAL_CENTER, "宋体", (short) 10, HSSFColor.YELLOW.index, true);
		for (int i = 0; i < columnSize; i++) {
			DataRow column = columnList.get(i);
			HSSFCell cell = thirdRow.createCell(i);
			String name = column.get("text").toString();
			boolean isNull=(boolean) column.get("isNull");
			cell.setCellValue(name);
			// 设置列名格式
			if (!isNull)
				cell.setCellStyle(nonBlankStyle);
			else
				cell.setCellStyle(blankStyle);
		}
		//sheet.protectSheet("XYZABCD.EFGEA");
	}

	private HSSFCellStyle createCellStyle(boolean locked,Short align, Short valign, String frontName, Short FontHeightInPoints, Short FillBackgroundColor, Boolean border) {
		HSSFCellStyle style = wb.createCellStyle();
		style.setWrapText(true);
		style.setLocked(locked);
		if (frontName != null) {
			HSSFFont font = wb.createFont();
			font.setFontName(frontName);
			font.setFontHeightInPoints(FontHeightInPoints);
			style.setFont(font);
		}
		if (align != null)
			style.setAlignment(align);
		if (valign != null)
			style.setVerticalAlignment(valign);
		if (FillBackgroundColor != null)
		{
			style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			style.setFillForegroundColor(FillBackgroundColor);
		}
		if (border) {
			style.setBorderBottom((short) 1);
			style.setBorderLeft((short) 1);
			style.setBorderRight((short) 1);
			style.setBorderTop((short) 1);
		}
		return style;
	}

	
	public Excel(DataList tableNameList, DataList columnsList) {
		wb = new HSSFWorkbook();
		// 创建sheet页
		HSSFSheet sheet = wb.createSheet();
		// sheet页名称
		wb.setSheetName(0, "sheet1");

		HSSFRow row_fir = sheet.createRow(0);

		HSSFCellStyle secondRowStyle=createCellStyle(false,CellStyle.ALIGN_RIGHT, CellStyle.VERTICAL_CENTER, "黑体", (short) 12, HSSFColor.YELLOW.index, true);
		sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnsList.size() - 1)); //合并
		HSSFCell cell_fir = row_fir.createCell(0);
		cell_fir.setCellStyle(secondRowStyle);
		cell_fir.setCellValue("面积单位：平方米                    金额单位：元");
		
		HSSFRow row = sheet.createRow(1);
		int i = 0;
		for (Map<String, Object> map : columnsList) {

			HSSFCell cell = row.createCell(i++);
			cell.setCellValue(map.get("text").toString());
		}
		int j = 2;
		for (Map<String, Object> m : tableNameList) {
			HSSFRow r = sheet.createRow(j++);
			int k = 0;
			for (Map<String, Object> map : columnsList) {
				String key = map.get("text").toString();
				HSSFCell cell = r.createCell(k++);
				cell.setCellValue(m.get(key).toString());
			}
		}
//		HSSFRow r = sheet.createRow(j);
//		HSSFCellStyle secondRowStyle=createCellStyle(false,CellStyle.ALIGN_LEFT, CellStyle.VERTICAL_CENTER, "黑体", (short) 12, HSSFColor.YELLOW.index, true);
//		sheet.addMergedRegion(new CellRangeAddress(j, j, 0, columnsList.size() - 1)); //合并
//		HSSFCell cell = r.createCell(0);
//		cell.setCellStyle(secondRowStyle);
//		cell.setCellValue("面积单位：平方米                    金额单位：元");

	}

	public DataList readExcelColumns() {
		return readExcelColumns(2); // 默认从第3行读取列名
	}
	
	public DataList readExcelColumns(int startRow) {
		DataList list = new DataList();
		for (int n = 0; n < wb.getNumberOfSheets(); n++) {
			Sheet sheet = wb.getSheetAt(n);
			Row row = sheet.getRow(startRow);
			if (row == null || row.getPhysicalNumberOfCells() == 0) {
				log.debug("sheet " + n + "没有数据");
				continue;
			} else {
				for (int i = 0; i < row.getPhysicalNumberOfCells(); i++) {
					DataRow dr = new DataRow();
					String s = (String) getCellFormatValue(row.getCell(i));
					log.debug("sheet " + n + " 单元格" + i + "：" + s);
					if (s == null || s.trim().equals("") )
						continue;
					dr.put("text", (String) getCellFormatValue(row.getCell(i)));
					dr.put("dataIndex", (String) getCellFormatValue(row.getCell(i)));
					dr.put("width", 250);
					list.add(dr);
				}
				break;
			}
		}

		return list;
	}

	public DataList readExcelContent() {
		return readExcelContent(2); // 默认从第4行开始读取数据
	}

	public DataList readExcelContent(int startRow) {
		DataList list = new DataList();
		for (int n = 0; n < wb.getNumberOfSheets(); n++) {
			Sheet sheet = wb.getSheetAt(n);
			Row row = sheet.getRow(startRow);
			if (row == null || row.getPhysicalNumberOfCells() == 0) {
				log.debug("sheet " + n + "没有数据");
				continue;
			} else {
				// 得到总行数
				int rowNum = sheet.getLastRowNum();
				//int colNum = row.getPhysicalNumberOfCells();// 每行的单元格数
				List<String> columns=new ArrayList<String>();
				for (int i = 0; i < row.getPhysicalNumberOfCells(); i++) {
					String s = (String) getCellFormatValue(row.getCell(i));
					if (s == null || s.trim().equals("") )
						continue;
					columns.add(s);
					
				}
				
				// int k;
				// 正文内容应该从第二行开始,第一行为表头的标题
				for (int i = startRow+1; i <= rowNum; i++) {
					// HashMap<String, String> map=new HashMap<String,
					// String>();
					DataRow dr = new DataRow();
					row = sheet.getRow(i);
					if (row == null)
						break;
					boolean empty=true;
					for (int j = 0; j < columns.size(); j++) {
						String value=getCellFormatValue(row.getCell(j)).trim();
						dr.put(columns.get(j), value);
						if(value.length()>0)
							empty=false;
					}
					if(!empty)
						list.add(dr);
				}
				break;
			}
		}

		return list;
	}
	
	public DataList readExcelContent_field1(int startRow) { //统计局专用excel读取方式
		DataList list = new DataList();
		for (int n = 0; n < wb.getNumberOfSheets(); n++) {
			Sheet sheet = wb.getSheetAt(n);
			Row row = sheet.getRow(startRow);
			if (row == null || row.getPhysicalNumberOfCells() == 0) {
				log.debug("sheet " + n + "没有数据");
				continue;
			} else {
				// 得到总行数
				int rowNum = sheet.getLastRowNum();
				//int colNum = row.getPhysicalNumberOfCells();// 每行的单元格数
				List<String> columns=new ArrayList<String>();
				for (int i = 0; i < row.getPhysicalNumberOfCells(); i++) {
					String s = (String) getCellFormatValue(row.getCell(i));
					if (s == null || s.trim().equals("") )
						continue;
					columns.add(s);
					log.debug("===============");
					log.debug(s);
				}
				
				// int k;
				// 正文内容应该从第第一行
				for (int i = startRow; i <= rowNum; i++) {
					// HashMap<String, String> map=new HashMap<String,
					// String>();
					DataRow dr = new DataRow();
					row = sheet.getRow(i);
					if (row == null)
						break;
					boolean empty=true;
					for (int j = 0; j < columns.size(); j++) {
						String value=getCellFormatValue(row.getCell(j)).trim();
						String colName="****";
						switch(j) {
						case 0:colName="A";  break;
						case 1:colName="B";  break;
						case 2:colName="C";  break;
						}
						dr.put(colName, value);
						if(value.length()>0)
							empty=false;
					}
					if(!empty)
						list.add(dr);
				}
				break;
			}
		}

		return list;
	}
	
	public Integer readBatchNo() {
		return readBatchNo(1);
	}
	public Integer readBatchNo(int startRow)
	{
		Integer batchNo=null;
		try {
		for (int n = 0; n < wb.getNumberOfSheets(); n++) {
			Sheet sheet = wb.getSheetAt(n);
			Row row = sheet.getRow(startRow);
			if (row == null || row.getPhysicalNumberOfCells() == 0) {
				log.debug("sheet " + n + "没有数据");
				continue;
			} else {
					String s = (String) getCellFormatValue(row.getCell(1));
					log.debug("批次：" + s);
					batchNo=Integer.parseInt(s);
			}
		}
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		return batchNo;

	}
	/**
	 * 根据HSSFCell类型设置数据
	 * 
	 * @param cell
	 * @return
	 */
	private static String getCellFormatValue(Cell cell) {
		String cellvalue = "";
		DecimalFormat dfs = new DecimalFormat("#.#########");
		if (cell != null) {
			// 判断当前Cell的Type
			System.out.println("type:  "+cell.getCellType());
			switch (cell.getCellType()) {
			// 如果当前Cell的Type为NUMERIC
			case HSSFCell.CELL_TYPE_NUMERIC:{
				// 判断当前的cell是否为Date
				if (HSSFDateUtil.isCellDateFormatted(cell)) {
					// 如果是Date类型则，转化为Data格式

					// 方法1：这样子的data格式是带时分秒的：2011-10-12 0:00:00
					// cellvalue = cell.getDateCellValue().toLocaleString();

					// 方法2：这样子的data格式是不带带时分秒的：2011-10-12
					Date date = cell.getDateCellValue();
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					cellvalue = sdf.format(date);
				}
				// 如果是纯数字
				else {
					// 取得当前Cell的数值
					// cellvalue = cell.getNumericCellValue();
					cellvalue = dfs.format(cell.getNumericCellValue());
					System.out.println("a error formula cell: "+cellvalue);
				}
				break;
			}
			case HSSFCell.CELL_TYPE_FORMULA: {
				cellvalue =cell.getCellFormula();
				break;
//				// 判断当前的cell是否为Date
//				if (HSSFDateUtil.isCellDateFormatted(cell)) {
//					// 如果是Date类型则，转化为Data格式
//
//					// 方法1：这样子的data格式是带时分秒的：2011-10-12 0:00:00
//					// cellvalue = cell.getDateCellValue().toLocaleString();
//
//					// 方法2：这样子的data格式是不带带时分秒的：2011-10-12
//					Date date = cell.getDateCellValue();
//					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//					cellvalue = sdf.format(date);
//				}
//				// 如果是纯数字
//				else {
//					// 取得当前Cell的数值
//					// cellvalue = cell.getNumericCellValue();
//					cellvalue = dfs.format(cell.getNumericCellValue());
//					System.out.println("a error formula cell: "+cellvalue);
//				}
//				break;
			}
			// 如果当前Cell的Type为STRIN
			case HSSFCell.CELL_TYPE_STRING:
				// 取得当前的Cell字符串
				cellvalue = cell.getStringCellValue();// cell.getRichStringCellValue().getString();
				System.out.println(cellvalue);
				break;
			// 默认的Cell值
			default:
				cellvalue = "";
			}
		} else {
			cellvalue = "";
		}
		return cellvalue;

	}

	public void download(HttpServletRequest request,HttpServletResponse response, String tableName) throws IOException {
		response.reset();
		response.setContentType("application/msexcel;charset=UTF-8");
		String filename = "";
		String userAgent = request.getHeader("user-agent").toLowerCase(); 
		if (userAgent.contains("msie") || userAgent.contains("like gecko") ) {
			// IE
			filename = URLEncoder.encode((tableName + ".xls"), "UTF-8");
		} else {
			// 非IE
			filename = new String((tableName + ".xls").getBytes("UTF-8"), "ISO8859_1");
		}
		response.addHeader("Content-Disposition", "attachment;filename=\"" + filename + "\"");
		OutputStream out = response.getOutputStream();
		wb.write(out);
		out.flush();
		out.close();

	}

	public void write(OutputStream outputStream) throws IOException {
		wb.write(outputStream);
	}

	public static void main(String args[]) throws FileNotFoundException, IOException
	{
		Excel excel=new Excel(new FileInputStream("/Users/constantine/eclipse-workspace/info.xls"));
		DataList list=excel.readExcelContent(0);
		MD5 m=new MD5();
		for(DataRow row:list) {
			row.put("纳税人名称",MD5.MD5WithSalt((String)row.get("纳税人名称")));//,,
			row.put("法定代表人（负责人、业主）姓名",MD5.MD5WithSalt((String)row.get("法定代表人（负责人、业主）姓名")));
			row.put("法定代表人（负责人、业主）身份证件号码",MD5.MD5WithSalt((String)row.get("法定代表人（负责人、业主）身份证件号码")));
			row.put("税收管理员",MD5.MD5WithSalt((String)row.get("税收管理员")));
		}
//		System.out.println(list);
		OutputStream out=new FileOutputStream("/Users/constantine/eclipse-workspace/企业信息.xls");
//		for(String c:list.get(0).keySet()) {
//			columns.add(e)
//		}
		// 创建sheet页
//				HSSFSheet sheet = wb.createSheet();
//				// sheet页名称
//				wb.setSheetName(0, "sheet1");
//
//				HSSFRow row = sheet.createRow(0);
//
//				int i = 0;
//				for (Map<String, Object> map : columnsList) {
//
//					HSSFCell cell = row.createCell(i++);
//					cell.setCellValue(map.get("text").toString());
//				}
//				int j = 1;
//				for (Map<String, Object> m : tableNameList) {
//					HSSFRow r = sheet.createRow(j++);
//					int k = 0;
//					for (Map<String, Object> map : columnsList) {
//						String key = map.get("text").toString();
//						HSSFCell cell = r.createCell(k++);
//						cell.setCellValue(m.get(key).toString());
//					}
//				}
		HSSFWorkbook wb=new HSSFWorkbook();
		HSSFSheet sheet = wb.createSheet();
		wb.setSheetName(0, "sheet1");
		HSSFRow row = sheet.createRow(0);
		int i=0;
		for(String column:list.get(0).keySet()) {
			HSSFCell cell = row.createCell(i++);
			cell.setCellValue(column);
		}
		i=1;
		int count=0;
		for(DataRow r:list) {
			System.out.println("count==="+count++);
			HSSFRow hr = sheet.createRow(i++);
			int j=0;
			for(String key:r.keySet()) {
				HSSFCell cell = hr.createCell(j++);
				cell.setCellValue((String)r.get(key));
			}
		}
		wb.write(out);
	}
}