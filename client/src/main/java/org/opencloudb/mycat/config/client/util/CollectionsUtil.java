package org.opencloudb.mycat.config.client.util;

import java.util.ArrayList;
import java.util.List;


public class CollectionsUtil {

	public static <T> List<T> unionList(List<T> la,List<T> lb) {
		if(la == null) {
			la = new ArrayList<T>();
		}
		if(lb == null) {
			lb = new ArrayList<T>();
		}
		List<T> cpLa = new ArrayList<T>();
		List<T> cpLb = new ArrayList<T>();
		cpLa.addAll(la);
		cpLb.addAll(lb);
		
		List<T> dumpList = new ArrayList<T>();
		for(T t : cpLa) {
			if(cpLb.contains(t)) {
				dumpList.add(t);
			}
		}
		cpLa.removeAll(dumpList);
		cpLb.removeAll(dumpList);
		cpLa.addAll(cpLb);
		return cpLa;
	}
}
