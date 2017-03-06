import React from 'react';

const svg = 
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 123.11 149.01">
		<g id="Layer_2" data-name="Layer 2">
			<g id="Layer_1-2" data-name="Layer 1">
				<rect 
					style={{
						fill: 'none', 
						stroke: '#ea2427', 
						strokeMiterlimit: '10', 
						strokeWidth: '2px'
					}} 
					x="1" 
					y="1" 
					width="121.11" 
					height="147.01"
				/>
			</g>
		</g>
	</svg>

const Toilet = () => {
	return (
		<div className="fp-room-wrapper">
			{svg}
		</div>
	);
}

export default Toilet;