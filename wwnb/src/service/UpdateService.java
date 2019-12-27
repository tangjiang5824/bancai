package service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateService extends BaseService {
	@Transactional
	public int[] batchUpdate(String...sql)
	{
		return jo.batchUpdate(sql);
	}
	@Transactional
	public int[] batchUpdate(String sql,List<Object[]> parameterList)
	{
		return jo.batchUpdate(sql, parameterList);
	}
	@Transactional
	public int update(String sql,Object...args)
	{
		
		return jo.update(sql, args);
	}
}
