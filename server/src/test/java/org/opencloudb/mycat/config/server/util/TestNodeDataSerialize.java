package org.opencloudb.mycat.config.server.util;

import java.io.Serializable;
import java.util.Arrays;

import org.I0Itec.zkclient.serialize.SerializableSerializer;
import org.junit.Assert;
import org.junit.Test;

public class TestNodeDataSerialize {
	private static byte[] preContent = new byte[]{-84,-19,0,5,116,0,4};
	
	@Test
	public void testNull() {
		byte[] content = null;
		Assert.assertNull(NodeDataSerialize.getSrcContent(content));
	}
	@Test
	public void testSrcTrue() {
		byte[] content = new byte[]{-84,-19,0,5,116,0,4,31,21};
		Assert.assertTrue(NodeDataSerialize.getSrcContent(content).length == 2);
		byte[] c2 = new byte[]{31,21};
		Assert.assertTrue(Arrays.equals(NodeDataSerialize.getSrcContent(content), c2));
	}
	@Test
	public void testSrcNull() {
		byte[] content = new byte[]{-84,-19,0,5,116,0,13,49,48,46,52,53,46,50,53,51,46,49,54,51};
		System.out.println(NodeDataSerialize.getSrcContent(content));
	}
	
	@Test
	public void testSeriaNull() {
		byte[] content = null;
		Assert.assertTrue(Arrays.equals(preContent, NodeDataSerialize.getDestContent(content)));
	}
	
	@Test
	public void testSeriaContent() {
		byte[] content = "hehe".getBytes();
		System.out.println(new String(NodeDataSerialize.getDestContent(content)));
	}
	@Test
	public void testSerialized() {
		String s = "hello";
		SerializableSerializer seria = new SerializableSerializer();
		
		TestSeria ts = new TestSeria();
		ts.s = "hello";
		
		byte[] content = seria.serialize(s);
		print(content);
		print(s.getBytes());
		print(seria.serialize(ts));
	}
	
	private void print(byte[] arrs) {
		for(byte t : arrs) {
			System.out.print(t + "\t");
		}
		System.out.println("");
	}

}
class TestSeria implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 468376151463091875L;
	/**
	 * 
	 */
	{
		System.out.println("out");
	}
	TestSeria(){
		System.out.println("in");
	}
	String s;
}