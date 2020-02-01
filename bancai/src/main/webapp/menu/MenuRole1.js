//税务管理员
Ext.define("menu.MenuRole1", {
			extend : "menu.BaseMenu",
			doLogout:function(){
				window.location.href = 'tax.jsp';
			},
			initComponent:function(){
				if(this.organizationId=="wzds")
				{
					this.store=Ext.create('Ext.data.TreeStore', {
						proxy: {
							type: 'ajax',
					        url: 'wzdsMenu.do',
					        reader: {
					            type: 'json'
					        }
						}
					});
				}else if(this.organizationId=="wzgs")
				{
					this.store=Ext.create('Ext.data.TreeStore', {
						proxy: {
							type: 'ajax',
					        url: 'wzgsMenu.do',
					        reader: {
					            type: 'json'
					        }
						}
					});
				}
				this.callParent();
			}
		})