//package filter;
//
//import java.io.IOException;
//
//import javax.servlet.Filter;
//import javax.servlet.FilterChain;
//import javax.servlet.FilterConfig;
//import javax.servlet.ServletException;
//import javax.servlet.ServletRequest;
//import javax.servlet.ServletResponse;
//import javax.servlet.annotation.WebFilter;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;
//
//import org.apache.log4j.Logger;
//@WebFilter(filterName="SessionFilter",urlPatterns="*.do")
//public class SessionFilter implements Filter {
//
//	private static Logger log = Logger.getLogger(SessionFilter.class);
//	@Override
//	public void destroy() {
//	}
//	@Override
//	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filter)
//			throws IOException, ServletException {
//		log.debug("开始过滤");
//		HttpServletRequest httpServletRequest = (HttpServletRequest) request;  
//        HttpServletResponse httpServletResponse = (HttpServletResponse) response; 
//        HttpSession session=httpServletRequest.getSession();
//        Integer role=(Integer) session.getAttribute("role");
//        String url=httpServletRequest.getServletPath();
//        log.debug("请求地址: "+url);
//        			if(role==null&&!url.equals("/login.do")) {
//        				log.debug("用户未登录");
//            			httpServletResponse.sendError(999);
//            			
//            		}
//            		else {
//            			log.debug("用户已经登录");
//            			filter.doFilter(request, response);
//            		}
//        		
//        		
//	}
//
//	@Override
//	public void init(FilterConfig arg0) throws ServletException {
//		
//	}
//
//
//}
