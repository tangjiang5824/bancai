package service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import util.risk.RiskBuilder;

@Service
public class RiskBuildService extends BaseService{
	@Transactional
	public int riskBuild(RiskBuilder builder) {
		return jo.update(builder.build());
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
