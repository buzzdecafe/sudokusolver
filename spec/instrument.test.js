var instrument = require('../src/js/instrument.js');

describe('instrument ::', function() { 

  it('is an object', function() {
    expect(typeof instrument).toBe('object');
  });

  describe('init ::', function() {
    it('returns an object', function() {
      expect(typeof instrument.init()).toBe('object');

      describe('init\'ed object', function() {
        var instr;
        beforeEach(function() {
          instr = instrument.init();
        });

        it('has the correct interface', function() {
          expect(typeof instr.getDuration).toBe('function');
          expect(typeof instr.getOps).toBe('function');
          expect(typeof instr.start).toBe('function');
          expect(typeof instr.end).toBe('function');
          expect(typeof instr.reset).toBe('function');
        });

        describe('getDuration', function() {
          it('returns the milliseconds between calling `start` and `end`', function() {
            var flag = false; 
            runs(function() {
              instr.start();
              setTimeout(function() { 
                instr.end(); 
                flag = true; 
              }, 1000);
            });

            waitsFor(function() { 
              return flag;
            }, 'getDuration failed', 1200);

            runs(function() {
              expect(instr.getDuration()/10).toBeCloseTo(100, 0);
            });
          });
        });

        describe('getOps', function() {
          it('returns the operation counter', function() {
            expect(instr.getOps()).toBe(0);
            instr.start();
            expect(instr.getOps()).toBe(1);
            instr.start();
            expect(instr.getOps()).toBe(2);
            instr.start();
            expect(instr.getOps()).toBe(3);
          });
        });
      });
    });
  });
});



