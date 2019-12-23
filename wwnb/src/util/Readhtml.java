package util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.ibm.wsdl.util.IOUtils;

import domain.DataList;
import domain.DataRow;

/**
 * DOM方式解析xml
 */
public class Readhtml {
	

	public static DataList getList(InputStream inputStream) throws UnsupportedEncodingException, IOException {
		DataList dataList = new DataList();
		
		String s=IOUtils.getStringFromReader(new InputStreamReader(inputStream,"UTF-8"));
		Document d=Jsoup.parse(s);
		Elements table=d.select("table tr");
		Element firstRow=table.get(0);
		List<String> columns=new ArrayList<String>();
		Elements columnElements=firstRow.select("td");
		for(Element ce:columnElements)
		{
			columns.add(ce.text());
		}
		for(int i=1;i<table.size()-1;i++)
		{
			DataRow row=new DataRow();
			Elements dataElements=table.get(i).select("td");
			for(int j=0;j<dataElements.size();j++)
			{
				row.put(columns.get(j), dataElements.get(j).text());
			}
			dataList.add(row);
		}
			
		return dataList;

	}

	public static void main(String[] args) {
		try {
			DataList list = getList(new FileInputStream("test.xls"));

			System.out.println(list.size());

			for (DataRow row : list) {
				System.out.println(row);
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}