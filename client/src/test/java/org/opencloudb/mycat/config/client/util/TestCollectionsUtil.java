package org.opencloudb.mycat.config.client.util;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import junit.framework.Assert;

import org.junit.Test;

public class TestCollectionsUtil {

	@Test
	public void testUnion() {
		List<String> list1 = new ArrayList<String>();
		list1.add("1");
		list1.add("2");
		list1.add("3");
		list1.add("4");
		list1.add("5");
		
		List<String> list2 = new ArrayList<String>();
		list2.add("2");
		list2.add("3");
		list2.add("4");
		list2.add("5");
		list2.add("6");
		List<String> l1 = CollectionsUtil.unionList(list1, list2);
		System.out.println(l1);
		
		List<String> result = new ArrayList<String>();
		result.add("1");
		result.add("6");
		Assert.assertTrue(Arrays.equals(l1.toArray(), result.toArray()));
	}
	@Test
	public void testProps() {
		try {
			String s = "a2\nba";
			Properties pro = new Properties();
			pro.load(new StringReader(s));
			System.out.println(pro);
			System.out.println(pro.keySet());
			System.out.println(pro.get("a"));
		} catch (IOException e) {
			e.printStackTrace();
			Assert.fail(e.getMessage());
		}
	}
}
