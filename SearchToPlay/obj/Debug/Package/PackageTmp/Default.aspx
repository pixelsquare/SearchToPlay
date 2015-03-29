<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="HTML_Project.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Search to Play!</title>
</head>
<body>
    <form id="form1" runat="server">
	<div id="wrapper">
		<div class="bg">
			<p>Search to play! | Copyright 2014</p>
			<canvas id="canvas" width="600px" height="600px"></canvas>
			<link href="css/style.css" rel="stylesheet" type="text/css" />
			<script src="js/game.js" type="text/javascript"></script>

			<div id="submitDiv">
				<table id="submitTable">
					<tr>
						<th colspan="3"><asp:Label ID="lblSubmit" runat="server" Text="Submit Score?"></asp:Label></th>
					</tr>
					<tr>
						<td><asp:Label ID="lblName" runat="server" Text="Name "></asp:Label></td>
						<td><asp:TextBox ID="tbName" runat="server" MaxLength="10"></asp:TextBox></td>
						<td><asp:Button ID="btnSubmit" runat="server" Text="Submit" 
											onclick="btnSubmit_Click"/></td>
					</tr>
					<tr>
						<th colspan="3"><asp:Label ID="lblEsc" runat="server" Text="Press (Esc) to Cancel" 
								Font-Size="10pt"></asp:Label></th>
					</tr>
				</table>
			</div>
		</div>

		<asp:GridView ID="gvDbArcade" runat="server" style="display:none;">
		</asp:GridView>
		<asp:GridView ID="gvDbTimeTrial" runat="server" style="display:none;">
		</asp:GridView>
		<asp:GridView ID="gvDatabase" runat="server" style="display:none;">
		</asp:GridView>

		<asp:HiddenField ID="hdfGameEndTime" runat="server" />
		<asp:HiddenField ID="hdfItemsPicked" runat="server" />
		<asp:HiddenField ID="hdfIsArcade" runat="server" />
	</div>
    </form>
</body>
</html>
